import { IUser } from "src/interfaces/user";
import { PrismaClient } from "@prisma/client";

class AuthorizeUsers {
    prisma;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async addUser(userData: IUser) {
        // do something with prisma
        try {

        } catch (error) {

        }
    }

    async getUserByUID(userUID: string) {
        // do something with prisma
        try {

        } catch (error) {

        }
    }

    async removeUser(userUID: string) {
        // do something with prisma
        try {

        } catch (error) {

        }
    }
}

export default AuthorizeUsers;