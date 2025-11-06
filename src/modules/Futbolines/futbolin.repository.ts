import { ApiError } from "@/utils/ApiError";
import { AgregarFutbolin, EditarFutbolinBody } from "futbol-in-core/schemas";
import { Types } from "mongoose";
import { FutbolinDoc, FutbolinModel } from "./futbolin.model";

const findById = async (id: string): Promise<FutbolinDoc> => {
  const doc = await FutbolinModel.findById(id).lean<FutbolinDoc>();
  if (!doc) throw new ApiError(404, "No se encontró el futbolín");
  return doc;
};

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

const findFromCiudad = async (ciudad: string): Promise<FutbolinDoc[]> => {
  const provincia = ciudad.trim().toLowerCase();

  // Escapa caracteres especiales de regex
  const escaped = provincia.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Regex que busque ", <provincia>" al final o en cualquier parte
  const regex = new RegExp(`${escaped}\\s*$`, "i");

  return await FutbolinModel.find({
    ciudad: { $regex: regex },
  }).lean<FutbolinDoc[]>();
};

const findFromMarca = async (marca: string): Promise<FutbolinDoc[]> => {
  const marcaSearch = marca.trim().toLowerCase();

  // Escapa caracteres especiales de regex
  const escaped = marcaSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Regex que busque ", <provincia>" al final o en cualquier parte
  const regex = new RegExp(`${escaped}\\s*$`, "i");

  return await FutbolinModel.find({
    tipoFutbolin: { $regex: regex },
  }).lean<FutbolinDoc[]>();
};

const update = async (id: string, update: EditarFutbolinBody) => {
  const { tipoFutbolin, distribucion, comentarios } = update;
  const doc = await FutbolinModel.findById(id);
  if (!doc) throw new ApiError(404, "No se encontró el futbolín");
  const updated = await FutbolinModel.findByIdAndUpdate(id, {
    tipoFutbolin,
    distribucion,
    comentarios,
  });
  return updated
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

const deleteById = async (id: string): Promise<number> => {
  const deletedCount = await FutbolinModel.deleteOne({ _id: new Types.ObjectId(id) });
  return deletedCount.deletedCount;
};

export const FutbolinRepository = {
  findById,
  findAll,
  update,
  findByUserId,
  create,
  findFromCiudad,
  findFromMarca,
  deleteById
};
