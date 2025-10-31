import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import { RankingQuery } from "futbol-in-core/schemas";
import { RankingService } from "./ranking.service";

export const RankingController = {
  getRanking: async (req: ValidatedRequest<any, any, RankingQuery>) => {
    const data = await RankingService.getRanking(req.validatedQuery.limit);
    return ok(data, "Ranking calculado");
  },
};
