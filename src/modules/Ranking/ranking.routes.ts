import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { Router } from "express";
import { rankingQuerySchema } from "futbol-in-core/schemas";
import { RankingController } from './ranking.controller';

const router = Router();

router.get(
  "/ranking",
  validateQuery(rankingQuerySchema),
  responseHandler(RankingController.getRanking)
);

export default router;
