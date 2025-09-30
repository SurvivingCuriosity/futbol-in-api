// src/modules/Ranking/ranking.service.ts
import Spot from "@/modules/Futbolines/futbolin.model";
import { UsuarioEnRanking } from "futbol-in-core/types";
import { PipelineStage, Types } from "mongoose";

type AggRow = {
  _id: Types.ObjectId;           // addedByUserId
  spotsCreados: number;
  user?: { name?: string }[];    // del $lookup
};

export async function getRanking(limit: number = 20): Promise<UsuarioEnRanking[]> {
  const pipeline: PipelineStage[] = [
    { $group: { _id: "$addedByUserId", spotsCreados: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",           // ⚠️ nombre real de la colección
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $sort: { spotsCreados: -1, _id: 1 } },
  ];

  if (Number.isFinite(limit)) {
    pipeline.push({ $limit: limit });
  }

  const rows = await Spot.aggregate<AggRow>(pipeline);

  const list: UsuarioEnRanking[] = rows.map((r, i) => ({
    id: String(r._id),
    posicion: i, // si prefieres 1-based: i + 1
    usuario: r.user?.[0]?.name ?? "(usuario desconocido)",
    spotsCreados: r.spotsCreados,
    puntuacion: r.spotsCreados, // ranking simple por nº de futbolines
  }));

  return list;
}

export const RankingService = { getRanking };
