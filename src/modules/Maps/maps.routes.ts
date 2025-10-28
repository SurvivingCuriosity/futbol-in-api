import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { Router } from "express";
import z from "zod";
import { MapsController } from "./maps.controller";

const router = Router();

const coordsQuerySchema = z.object({
  placeId: z.string().min(1, "placeId es requerido"),
});
export type CoordsQuery = z.infer<typeof coordsQuerySchema>;

const baresAutoCompleteSchema = z.object({
  input: z.string().min(1, "placeId es requerido"),
});
export type BaresAutoCompleteQuery = z.infer<typeof baresAutoCompleteSchema>;

const coordsFromStringSchema = z.object({
  string: z.string().min(1, "placeId es requerido"),
});
export type CoordsFromStringQuery = z.infer<typeof coordsFromStringSchema>;

const searchMunicipioQuerySchema = z.object({
  q: z.string().min(1, "q es requerido"),
});
export type SearchMunicipioQuery = z.infer<typeof searchMunicipioQuerySchema>;

router.get(
  "/maps/getCoordinatesFromPlaceId",
  validateQuery(coordsQuerySchema),
  responseHandler(MapsController.coordinatesFromPlaceId)
);

router.get(
  "/maps/bares-autocomplete",
  validateQuery(baresAutoCompleteSchema),
  responseHandler(MapsController.baresAutocomplete)
);

router.get(
  "/maps/direcciones-autocomplete",
  validateQuery(baresAutoCompleteSchema),
  responseHandler(MapsController.direccionesAutocomplete)
);

router.get(
  "/maps/getCoordinatesFromString",
  validateQuery(coordsFromStringSchema),
  responseHandler(MapsController.coordinatesFromString)
);

router.get(
  "/maps/searchMunicipio",
  validateQuery(searchMunicipioQuerySchema),
  responseHandler(MapsController.searchMunicipio)
);

export default router;
