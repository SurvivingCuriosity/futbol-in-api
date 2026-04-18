import { getSignedReadUrl } from "@/infra/gcp_storage.service";
import { FutbolinModel } from "@/modules/Futbolines/futbolin.model";
import { UsuarioEnRanking } from "futbol-in-core/types";
import { PipelineStage, Types } from "mongoose";

type AggRow = {
  _id: Types.ObjectId;
  spotsCreados: number;
  user?: { nombre?: string; name?: string; imagen?: string; createdAt?: Date }[];
};

export async function getRanking(limit: number = 20): Promise<UsuarioEnRanking[]> {
  const pipeline: PipelineStage[] = [
    { $group: { _id: "$addedByUserId", spotsCreados: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $sort: { spotsCreados: -1, _id: 1 } },
  ];

  if (Number.isFinite(limit)) pipeline.push({ $limit: limit });

  const rows = await FutbolinModel.aggregate<AggRow>(pipeline);

  // 🔹 Firmamos las imágenes en paralelo (si existen)
  const list: UsuarioEnRanking[] = await Promise.all(
    rows.map(async (r, i) => {
      const usuario = r.user?.[0];
      let imagenUrl: string | null = null;

      if (usuario?.imagen) {
        try {
          imagenUrl = await getSignedReadUrl(usuario.imagen);
        } catch (err) {
          console.error(`Error firmando imagen de usuario ${usuario.nombre}:`, err);
        }
      }

      return {
        id: String(r._id),
        posicion: i,
        usuario: usuario?.name ?? usuario?.nombre ?? "(desconocido)",
        imagen: imagenUrl ?? "",
        spotsCreados: r.spotsCreados,
        puntuacion: r.spotsCreados,
        createdAt: usuario?.createdAt?.toISOString(),
      };
    })
  );

  return list;
}

export const RankingService = { getRanking };
