import { PrismaClient } from "@prisma/client";
import GoogleClient from "./googleClient";

const apiKey = process.env.GOOGLE_API_KEY;

const prisma = new PrismaClient();
const googleClient = new GoogleClient(apiKey);

export { prisma, googleClient };
