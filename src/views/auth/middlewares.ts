import firebaseAdmin from "@utils/firebase";
import { Middleware } from "src/interfaces/express_shortcuts";

/**
 * Middleware that verifies if the request have a valid 'auth' header.
 */
export const authenticateUser: Middleware = async (req, res, next) => {
  // We store the token inside this variable
  const authHeader = req.headers.authorization;

  // If we don't have the authHeader, we return as Unathorized
  if (authHeader === undefined) {
    return res.status(401).send({
      message: "Not authorized",
      code: "M1",
    });
  }

  // Token with format of `Bearer ${token}`.
  // We use only the tokenId.
  const token = authHeader.split(" ")[1];

  // Depending of the user, we auth it, or we decline the request.
  await firebaseAdmin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.body.userId = decodedToken.uid;
      next();
    })
    .catch((e) => {
      console.log(e);
      res.status(401).send({ message: "Not auth", code: "M2" });
    });
};
