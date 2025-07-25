import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { Router } from "express";
import z from "zod";
import { MapsController } from './maps.controller';

const router = Router();

const coordsQuerySchema = z.object({
  placeId: z.string().min(1, 'placeId es requerido'),
});

export type CoordsQuery = z.infer<typeof coordsQuerySchema>;

router.get(
  "/maps/getCoordinatesFromPlaceId",
  validateQuery(coordsQuerySchema),
  responseHandler(MapsController.coordinatesFromPlaceId)
);

export default router;
