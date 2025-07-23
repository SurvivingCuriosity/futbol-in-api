import { getRankingController } from "@/controllers/ranking.controller";
import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { Router } from "express";
import { rankingQuerySchema } from "futbol-in-core/schemas";

const router = Router();

router.get(
  "/ranking",
  validateQuery(rankingQuerySchema),
  responseHandler(getRankingController)
);

export default router;
