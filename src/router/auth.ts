import express, { Request, Response, Router } from "express";
import { insertNewUser, authenticateSessionWithFirebase, getUserByUID, verifySessionCookie, logout } from '../auth/controllers/authController';
const router: Router = express.Router();

// How to use:
// 1. From the front end, after receiving the 'token' and 'uid' from firebase,
// make a new post request to the /register route on the backend. Make sure credentials: 'include' is set
// so that the token is received. This token is a temporary token used to authenticate the uid by firebase.
// 2. insertNewUser puts the user information (uid) into our database
// 3. authenticateSessionWithFirebase creates a session cookie which is then sent back to the front end
router.post('/register', 
    insertNewUser,
    authenticateSessionWithFirebase,
    (req: Request, res: Response) => {
        res.status(200).json({ message: "Registration was successful!", username: req.body.username, role: req.body.role, uid: req.body.uid });
    }
);

// This works the same way as registrataion, but this time we get the user's details from our
// database using the uid that is sent from firebase
// then we create the session cookie with firebase.
router.post('/login',
    getUserByUID,
    authenticateSessionWithFirebase,
    (req: Request, res: Response) => {
        res.status(200).json({ message: "Login was successful!", username: req.body.username, role: req.body.role, uid: req.body.uid });
    }
);

router.post('/verify-session', verifySessionCookie, (req: Request, res: Response) => {
    res.status(200).json({ message: "Current session verified" });
});

router.get('/logout',
    verifySessionCookie,
    logout,
    (req: Request, res: Response) => {
        res.status(200).json({ message: "logged out!" });
    }
);

export default router;