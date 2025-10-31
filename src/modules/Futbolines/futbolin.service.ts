import {
  FutbolinRepository,
  SpotCreationInput,
} from "@/modules/Futbolines/futbolin.repository.js";
import { TipoFutbolin, TipoLugar, UserRole } from "futbol-in-core/enum";
import { AgregarFutbolin } from "futbol-in-core/schemas";
import { SpotDTO } from "futbol-in-core/types";
import { Types } from "mongoose";
import { UserService } from "../User/user.service";
import { FutbolinDoc } from "./futbolin.model";

const getAll = async (): Promise<SpotDTO[]> => {
  const docs = await FutbolinRepository.findAll();
  return docs.map(toDTO);
};

const getSpotsDeUsuario = async (idUsuario: string): Promise<SpotDTO[]> => {
  const spots = await FutbolinRepository.findByUserId(idUsuario);
  return spots.map(toDTO);
};

export const agregarFutbolin = async (
  req: AgregarFutbolin,
  userJwt: { id: string; role: string[] }
): Promise<SpotDTO> => {
  const futbolinACrear = req;

  // 2. Obtener user DB (p/ stats y role)
  const userDb = await UserService.findById(userJwt.id);

  // 3. Construir documento

  const addedByUserId = new Types.ObjectId(userDb.id);
  const verificado = userJwt.role.includes(UserRole.VERIFICADO)
    ? {
        correcto: true,
        idUser: new Types.ObjectId(userDb.id), // mismo tipo
        fechaVerificacion: new Date(),
      }
    : null;

  const doc: SpotCreationInput = {
    ...futbolinACrear,
    addedByUserId,
    verificado,
    idOperador: null,
    coordinates: [futbolinACrear.coordinates[1], futbolinACrear.coordinates[0]],
  };

  // 4. Crear
  const created = await FutbolinRepository.create(doc);

  // 5. Stats
  // await UserService.incrementUserStat(userDb.id, 'addedFutbolines');

  // 6. DTO
  return toDTO(created);
};

// TODO UPDATE SPOTDTO
const toDTO = (lugar: FutbolinDoc): SpotDTO => ({
  id: String(lugar._id),
  nombre: lugar.nombre,
  direccion: lugar.direccion,
  googlePlaceId: lugar.googlePlaceId,
  ciudad: lugar.ciudad,
  coordinates: [
    lugar.location?.coordinates[1] ?? 0,
    lugar.location?.coordinates[0] ?? 0,
  ],
  tipoLugar: lugar.tipoLugar as TipoLugar,
  tipoFutbolin: lugar.tipoFutbolin as TipoFutbolin,
  distribucion: lugar.distribucion,
  comentarios: lugar.comentarios ?? "",
  addedByUserId: String(lugar.addedByUserId),
  createdAt: lugar.createdAt,
  updatedAt: lugar.updatedAt,
  idOperador: null,
  verificado: null,
  votes: {up:[], down:[]},
});

export const FutbolinService = {
  getAll,
  getSpotsDeUsuario,
  agregarFutbolin,
};
