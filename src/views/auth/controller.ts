import { Request, Response } from "express";
import AuthorizeUsers from "./model";
import { Controller } from "src/interfaces/express_shortcuts";
import firebaseAdmin from "@utils/firebase";

/**
 * Magage all http request about handling information about the user
 */
const authModel = new AuthorizeUsers();

export const addUser: Controller = async (req, res) => {
  try {
    const { uid } = req.body;

    // We add the current user in our db
    const user = await firebaseAdmin.auth().getUser(uid);

    await authModel.addUser({
      uid: user.uid,
      displayName: user.displayName || "temp",
    });

    res.status(201).json({
      message: "User added successfully",
      data: {
        displayName: user.displayName || "temp",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error trying to create a user" });
  }
};
