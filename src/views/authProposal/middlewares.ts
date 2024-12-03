import { Request, Response, NextFunction } from "express";
import firebaseAdmin from "@utils/firebase";
import { Middleware } from "src/interfaces/express_shortcuts";

interface CustomRequest extends Request {
  user?: firebaseAdmin.auth.DecodedIdToken;
}

/**
 * Middleware to only accepts users data!
 * @param req
 * @param res
 * @param next
 */
export const authenticateUser: Middleware = async (req, res, next) => {
  // LAB
  // Temporal patch
  const UID = "8rp94zwqfYQFuPOMe9RD6LjaEk53";
  next();
  // const sessionCookie = req.cookies.session || "";

  // if (!sessionCookie) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // try {
  //   const decodedClaims = await firebaseAdmin
  //     .auth()
  //     .verifySessionCookie(sessionCookie, true);
  //   (req as CustomRequest).user = decodedClaims;

  //   // Append userId in every request
  //   req.body.userId = decodedClaims.uid;

  //   next();
  // } catch (error) {
  //   res.clearCookie("session");
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
};
