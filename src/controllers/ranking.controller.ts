import { getRanking } from "@/services/ranking.service";
import { ok } from "@/utils/ApiResponse";
import { ApiResponse } from "@/utils/ApiResponse";
import { RankingQuery } from "@/validation/ranking/getRanking.validation";
import { UsuarioEnRanking } from "futbol-in-core/types";

export const getRankingController = async (
  req: { validatedQuery: RankingQuery }
): Promise<ApiResponse<UsuarioEnRanking[]>> => {
  const data = await getRanking(req.validatedQuery.limit);
  return ok(data, "Ranking calculado");
};
