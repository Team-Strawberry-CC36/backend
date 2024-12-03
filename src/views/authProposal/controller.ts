import { Request, Response } from "express";
import AuthorizeUsers from "./model";
import { Controller } from "src/interfaces/express_shortcuts";

/**
 * Magage all http request about handling information about the user
 */
const authModel = new AuthorizeUsers();

export const addUser: Controller = async (req, res) => {
  // try {
  //     const userData = req.body;
  //     await authModel.addUser(userData);
  //     res.status(201).json({ message: "User added successfully" });
  // } catch (error) {
  //     res.status(500).json({ error: error.message });
  // }
};

export const getUser = async (req: Request, res: Response) => {
  // try {
  //     const { uid } = req.params;
  //     const user = await authModel.getUserByUID(uid);
  //     if (!user) {
  //         return res.status(404).json({ message: "User not found" });
  //     }
  //     res.status(200).json(user);
  // } catch (error) {
  //     res.status(500).json({ error: error.message });
  // }
};

export const removeUser = async (req: Request, res: Response) => {
  // try {
  //     const { uid } = req.params;
  //     await authModel.removeUser(uid);
  //     res.status(200).json({ message: "User removed successfully" });
  // } catch (error) {
  //     res.status(500).json({ error: error.message });
  // }
};
