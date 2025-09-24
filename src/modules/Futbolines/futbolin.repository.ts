import { ApiError } from "@/utils/ApiError";
import { AgregarFutbolin } from "futbol-in-core/schemas";
import { Types } from "mongoose";
import Spot, { ISpot } from "./futbolin.model";

const findAll = async (): Promise<ISpot[]> => {
  const allFutbolines = await Spot.find().lean<ISpot[]>();
  console.log('En repo: ', allFutbolines[0])
  return allFutbolines;
};

const findByUserId = async (idUsuario: string): Promise<ISpot[]> => {
  const spotsDeUsuario = await Spot.find({
    addedByUserId: idUsuario,
  }).lean<ISpot[]>();
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
  const exists = await Spot.findOne({
    googlePlaceId: spot.googlePlaceId,
    tipoFutbolin: spot.tipoFutbolin,
  });
  if (exists) {
    throw new ApiError(319, "Este futbolín ya está agregado");
  }

  // Crear el documento
  const created = await Spot.create({
    ...spot,
    location: {
      type: "Point",
      coordinates: spot.coordinates,
    },
  });

  return created.toObject<ISpot>();
};

export const FutbolinRepository = {
  findAll,
  findByUserId,
  create,
};
