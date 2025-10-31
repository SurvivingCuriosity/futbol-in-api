import { Types } from "mongoose";
import { IncidenciaDoc, IncidenciaModel } from "./incidencia.model";

const create = async (input: {
  spotId: Types.ObjectId;
  userId: Types.ObjectId;
  texto: string;
}) => {
  const doc = await IncidenciaModel.create(input);
  return doc.toObject<IncidenciaDoc>();
};

const findAll = async (): Promise<IncidenciaDoc[]> => {
  return IncidenciaModel.find().lean<IncidenciaDoc[]>();
};

const findBySpotId = async (spotId: string): Promise<IncidenciaDoc[]> => {
  return IncidenciaModel.find({ spotId })
    .sort({ createdAt: -1 })
    .lean<IncidenciaDoc[]>();
};

const findById = async (id: string): Promise<IncidenciaDoc | null> => {
  return IncidenciaModel.findById(id).lean<IncidenciaDoc | null>();
};

const resolveById = async (id: string, resuelto: boolean) => {
  const updated = await IncidenciaModel.findByIdAndUpdate(
    id,
    { $set: { resuelto } },
    { new: true }
  ).lean<IncidenciaDoc | null>();
  return updated;
};

const removeById = async (id: string) => {
  await IncidenciaModel.findByIdAndDelete(id);
};

export const IncidenciaRepository = {
  create,
  findAll,
  findBySpotId,
  findById,
  resolveById,
  removeById,
};
