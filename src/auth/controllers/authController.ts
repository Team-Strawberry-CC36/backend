import { Request, Response, NextFunction } from 'express';
import "express";
import firebaseAdmin from '../../utils/firebase';
import AuthorizeUsers from '../models/authModel';
import { IUser } from 'src/interfaces/user';

const testRequest: Request = {} as any;
console.log(testRequest.user);

export const insertNewUser = (req: Request, res: Response, next: NextFunction) => {
    // Prepare user input data for the AuthorizeUsers model.

    // TO DO:
    // const userData: IUser = 

    try {
        const auth = new AuthorizeUsers();
        // TO DO
        //auth.addUser(userData);
        next();
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}

export const getUserByUID = (req: Request, res: Response, next: NextFunction) => {
    // Prepare data 

    // TODO:
    // const uid = ;
    try {
        const auth = new AuthorizeUsers();
        // TO DO
        // auth.getUserByUID
        next()
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

    next();
}

export const authenticateSessionWithFirebase = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        const error = new Error("Unauthorised") as any;
        error.status = 401;
        return next(error);
    }

    try {
        // Generate a session cookie to expire in 5 days
        const sessionCookie = await firebaseAdmin.auth().createSessionCookie(token, { expiresIn: 60 * 60 * 24 * 5 * 1000});

        res.cookie("session", sessionCookie, {
            maxAge: 60 * 60 * 24 * 5 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
        });

        next();

    } catch (error) {
        console.log("Oh dear, something went wrong:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const verifySessionCookie = async (req: Request, res: Response, next: NextFunction) => {
    const sessionCookie = req.cookies.session || "";
    console.log("Verifying session cookie...");
    try {
        const decodedClaims = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims as firebaseAdmin.auth.DecodedIdToken;
        next();
    } catch (error) {
        res.clearCookie("session"); // Clear cookie if verification fails
        res.status(401).json({ message: "unauthorized" });
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Clearing cookie");
        res.clearCookie('session');
        if (!req.user || !req.user.sub) {
            throw new Error("User is not authenticated or 'sub' is missing.");
        }
        await firebaseAdmin.auth().revokeRefreshTokens(req.user.sub);
        next();
    } catch (error) {
        res.status(401).json({ message: "unauthorized" });
    }
    
};