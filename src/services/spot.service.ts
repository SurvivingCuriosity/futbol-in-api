import { ISpot } from "@/models/futbolin.model.js";
import { findAll } from "@/repositories/futbolin.repository.js";
import { TipoFutbolin, TipoLugar } from "futbol-in-core/enum";
import { SpotDTO } from "futbol-in-core/types";

export const getAll = async (): Promise<SpotDTO[]> => {
  const docs = await findAll();
  return docs.map(toDTO);
};

const toDTO = (lugar: ISpot): SpotDTO => ({
  id: String(lugar._id),
  nombre: lugar.nombre,
  direccion: lugar.direccion,
  googlePlaceId: lugar.googlePlaceId,
  ciudad: lugar.ciudad,
  coordinates: [...lugar.location.coordinates],
  idOperador: lugar.idOperador ? String(lugar.idOperador) : null,
  tipoLugar: lugar.tipoLugar as TipoLugar,
  tipoFutbolin: lugar.tipoFutbolin as TipoFutbolin,
  distribucion: lugar.distribucion,
  comentarios: lugar.comentarios,
  addedByUserId: String(lugar.addedByUserId),
  verificado: lugar.verificado
    ? {
        correcto: lugar.verificado.correcto,
        idUser: String(lugar.verificado.idUser),
        fechaVerificacion: lugar.verificado.fechaVerificacion,
      }
    : null,
  votes: {
    up: lugar.votes.up.map((u: any) => String(u)),
    down: lugar.votes.down.map((u: any) => String(u)),
  },
});
