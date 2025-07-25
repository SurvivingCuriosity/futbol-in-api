import { UserService } from './../User/user.service';
import { UsuarioEnRanking } from "futbol-in-core/types";

const getRanking = async (limit?: number): Promise<UsuarioEnRanking[]> => {
  // 1. Traer usuarios (idealmente solo los campos necesarios)
  const users = await UserService.getAllUsers();

  // 2. Mapear + puntuar
  const list: UsuarioEnRanking[] = users.map((user, idx) => ({
    id: user.id,
    usuario: user.name,
    posicion: idx, // si quieres ordenar por score, cambia abajo
    spotsCreados: user.stats.lugaresAgregados ?? 0,
    spotsVotados: user.stats.lugaresRevisados ?? 0,
    spotsVerificados: user.stats.lugaresVerificados ?? 0,
    puntuacion: score(
      user.stats.lugaresAgregados ?? 0,
      user.stats.lugaresRevisados ?? 0,
      user.stats.lugaresVerificados ?? 0
    ),
  }));

  // (Opcional) ordenar por puntuación descendente:
  list.sort((a, b) => b.puntuacion - a.puntuacion)
      .forEach((u, i) => (u.posicion = i));

  return typeof limit === "number" ? list.slice(0, limit) : list;
};

const score = (agregados: number, revisados: number, verificados: number) =>
  agregados * 5 + revisados * 2 + verificados * 2;


export const RankingService = {
  getRanking,
};