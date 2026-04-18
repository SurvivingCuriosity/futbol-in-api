import { Types } from "mongoose";
import { FutbolinModel } from "../Futbolines/futbolin.model";

const push = async (
  spotId: string,
  input: { userId: Types.ObjectId; texto: string }
) => {
  return FutbolinModel.findByIdAndUpdate(
    spotId,
    { $push: { incidencias: { ...input, createdAt: new Date() } } },
    { new: true }
  ).lean();
};

const resolveById = async (
  spotId: string,
  incidenciaId: string,
  resuelto: boolean
) => {
  return FutbolinModel.findOneAndUpdate(
    { _id: spotId, "incidencias._id": new Types.ObjectId(incidenciaId) },
    { $set: { "incidencias.$.resuelto": resuelto } },
    { new: true }
  ).lean();
};

const pull = async (spotId: string, incidenciaId: string) => {
  return FutbolinModel.findByIdAndUpdate(
    spotId,
    { $pull: { incidencias: { _id: new Types.ObjectId(incidenciaId) } } },
    { new: true }
  ).lean();
};

const findIncidenciaInSpot = async (spotId: string, incidenciaId: string) => {
  const spot = await FutbolinModel.findOne(
    { _id: spotId, "incidencias._id": new Types.ObjectId(incidenciaId) },
    { "incidencias.$": 1 }
  ).lean();
  return spot?.incidencias?.[0] ?? null;
};

export const IncidenciaRepository = {
  push,
  resolveById,
  pull,
  findIncidenciaInSpot,
};
