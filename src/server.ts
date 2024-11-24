import express, { Express, Request, Response } from "express";
// Middlewares
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
// Environment variables
import "dotenv/config";

import router from "./router";

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

app.use("/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Working!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
