import Spot, { ISpot } from "@/models/futbolin.model";

export const findAll = async (): Promise<ISpot[]> => {
  const allFutbolines = await Spot.find().lean<ISpot[]>();
  return allFutbolines;
};
