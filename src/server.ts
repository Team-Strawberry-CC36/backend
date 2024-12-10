import express, { Express, Request, Response } from "express";
// Middlewares
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
// Environment variables
import "dotenv/config";

import router from "@router/index";
import moreTestingRouter from "@router/moreTesting";
import placesRouter from "./views/places/view";
import helpfulnessRouter from "./views/helpfullness/view";
import authRouter from "src/views/auth/view";
import userRouter from "./views/users/view";
import experienceRouter from "./views/experiences/view";
import { authenticateUser } from "@auth/middlewares";

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

// Public routes
app.use("/auth", authRouter);

// Middleware
app.use(authenticateUser);

// Private routes
app.use(userRouter);
app.use(router);
app.use(helpfulnessRouter);
app.use(experienceRouter);
app.use(placesRouter);

// Testing endpoints
app.use("/moreTesting", moreTestingRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
