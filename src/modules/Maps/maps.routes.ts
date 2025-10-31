import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { Router } from "express";
import { MapsController } from "./maps.controller";
import {
  baresAutoCompleteSchema,
  coordsFromStringSchema,
  coordsQuerySchema,
  searchMunicipioQuerySchema,
} from "futbol-in-core/schemas";

const router = Router();

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
