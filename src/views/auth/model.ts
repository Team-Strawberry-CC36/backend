import { PrismaClient } from "@prisma/client";
import { IUser } from "src/interfaces/user";
import { prisma } from "@utils/index";

/**
 * AuthorizeModel is for interacting with the prisma database
 */
class AuthorizeModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Add a new user to the database
   * @param userData IUser - User data to be added
   */
  async addUser(userData: IUser): Promise<void> {
    try {
      await this.prisma.users_accounts.create({
        data: {
          id: userData.uid,
          username: userData.displayName,
        },
      });
      console.log("User added successfully.");
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user.");
    }
  }

  /**
   * Get a user by their UID
   * @param userUID string - The UID of the user
   * @returns IUser | null - The user object or null if not found
   */
  async getUserByUID(userUID: string): Promise<IUser | null> {
    try {
      const user = await this.prisma.users_accounts.findUnique({
        where: { id: userUID },
      });

      if (!user) {
        console.log(`User with UID ${userUID} not found.`);
        return null;
      }

      return {
        uid: user.id,
        displayName: user.username,
      };
    } catch (error) {
      console.error("Error fetching user by UID:", error);
      throw new Error("Failed to fetch user.");
    }
  }

  /**
   * Remove a user from the database by their UID
   * @param userUID string - The UID of the user to be removed
   */
  async removeUser(userUID: string): Promise<void> {
    try {
      await this.prisma.users_accounts.delete({
        where: { id: userUID },
      });
      console.log(`User with UID ${userUID} removed successfully.`);
    } catch (error) {
      console.error("Error removing user:", error);
      throw new Error("Failed to remove user.");
    }
  }
}

export default AuthorizeModel;
