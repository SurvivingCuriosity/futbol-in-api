import Spot, { ISpot } from "@/models/futbolin.model";

export const findAll = async (): Promise<ISpot[]> => {
  const allFutbolines = await Spot.find().lean<ISpot[]>();
  return allFutbolines;
};

export const findByUserId = async (
  idUsuario: string
): Promise<ISpot[]> => {
  const spotsDeUsuario = await Spot.find({
    addedByUserId: idUsuario,
  }).lean<ISpot[]>();
  return spotsDeUsuario;
};
