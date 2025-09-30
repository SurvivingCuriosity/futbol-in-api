import { Types } from "mongoose";
import Incidencia, { IIncidencia } from "./incidencia.model";

const create = async (input: {
  spotId: Types.ObjectId;
  userId: Types.ObjectId;
  texto: string;
}) => {
  const doc = await Incidencia.create(input);
  return doc.toObject<IIncidencia>();
};

const findAll = async (): Promise<IIncidencia[]> => {
  return Incidencia.find().lean<IIncidencia[]>();
};

const findBySpotId = async (spotId: string): Promise<IIncidencia[]> => {
  return Incidencia.find({ spotId })
    .sort({ createdAt: -1 })
    .lean<IIncidencia[]>();
};

const findById = async (id: string): Promise<IIncidencia | null> => {
  return Incidencia.findById(id).lean<IIncidencia | null>();
};

const resolveById = async (id: string, resuelto: boolean) => {
  const updated = await Incidencia.findByIdAndUpdate(
    id,
    { $set: { resuelto } },
    { new: true }
  ).lean<IIncidencia | null>();
  return updated;
};

const removeById = async (id: string) => {
  await Incidencia.findByIdAndDelete(id);
};

export const IncidenciaRepository = {
  create,
  findAll,
  findBySpotId,
  findById,
  resolveById,
  removeById,
};
