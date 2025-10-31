import { ApiError } from "@/utils/ApiError";
import { AgregarFutbolin } from "futbol-in-core/schemas";
import { Types } from "mongoose";
import { FutbolinDoc, FutbolinModel } from "./futbolin.model";

const findAll = async (): Promise<FutbolinDoc[]> => {
  const allFutbolines = await FutbolinModel.find().lean<FutbolinDoc[]>();
  return allFutbolines;
};

const findByUserId = async (idUsuario: string): Promise<FutbolinDoc[]> => {
  const spotsDeUsuario = await FutbolinModel.find({
    addedByUserId: idUsuario,
  }).lean<FutbolinDoc[]>();
  return spotsDeUsuario;
};

export type SpotCreationInput = AgregarFutbolin & {
  addedByUserId: Types.ObjectId;
  idOperador: Types.ObjectId | null;
  coordinates: [number, number];
  verificado: {
    correcto: boolean;
    idUser: Types.ObjectId;
    fechaVerificacion: Date;
  } | null;
};

const create = async (spot: SpotCreationInput) => {
  const exists = await FutbolinModel.findOne({
    googlePlaceId: spot.googlePlaceId,
    tipoFutbolin: spot.tipoFutbolin,
  });
  if (exists) {
    throw new ApiError(319, "Este futbolín ya está agregado");
  }

  // Crear el documento
  const created = await FutbolinModel.create({
    ...spot,
    location: {
      type: "Point",
      coordinates: spot.coordinates,
    },
  });

  return created.toObject<FutbolinDoc>();
};

export const FutbolinRepository = {
  findAll,
  findByUserId,
  create,
};
