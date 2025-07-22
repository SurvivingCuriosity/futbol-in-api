import { getRankingController } from "@/controllers/ranking.controller";
import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { rankingQuerySchema } from "@/validation/ranking/getRanking.validation";
import { Router } from "express";

const router = Router();

router.get(
  "/ranking",
  validateQuery(rankingQuerySchema),
  responseHandler(getRankingController)
);

export default router;
