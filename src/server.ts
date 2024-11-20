import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import authRouter from "@router/auth";
import touristsRouter from "@router/tourists";
import ownersRouter from "@router/owners";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
const corsOptions : CorsOptions = {
    origin: `${process.env.FRONTEND_URL}` || "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Routes
app.use("/auth", authRouter);
app.use("/tourists", touristsRouter);
app.use("/owners", ownersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Working!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const prisma = new PrismaClient();
