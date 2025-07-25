import { CoordsQuery } from "@/modules/Maps/maps.routes";
import { getCoordinatesFromPlaceId } from "@/infra/googlemaps.service";
import { ApiResponse, ok } from "@/utils/ApiResponse";

const coordinatesFromPlaceId = async (req: {
  validatedQuery: CoordsQuery;
}): Promise<ApiResponse<{ lat: number; lng: number }>> => {
  const data = await getCoordinatesFromPlaceId(req.validatedQuery.placeId);
  return ok(data, "Coordenadas obtenidas");
};

export const MapsController = {
  coordinatesFromPlaceId,
};