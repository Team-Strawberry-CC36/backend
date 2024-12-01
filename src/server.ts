import express, { Express, Request, Response } from "express";
// Middlewares
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
// Environment variables
import "dotenv/config";

import router from "@router/index";
import testingRouter from "@router/testing";
import moreTestingRouter from "@router/moreTesting";
import auth from "@router/auth";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
const corsOptions: CorsOptions = {
  origin: `${process.env.FRONTEND_URL}` || "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Use routes
app.use("/", router);
app.use("/testing", testingRouter);
app.use("/moreTesting", moreTestingRouter);
app.use("/auth", auth); // for registration, login, logout


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Working!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
