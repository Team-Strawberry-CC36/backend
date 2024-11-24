import express, { Request, Response, Router } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import GeneralModel from "src/models";

// Router
const router: Router = express.Router();

router.get("/places", async (req: Request, res: Response) => {
  const data = GeneralModel.getInitialData();

  res.send({
    data,
  });
});

export default router;
