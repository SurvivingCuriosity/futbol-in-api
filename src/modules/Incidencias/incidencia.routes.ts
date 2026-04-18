import { responseHandler } from "@/middleware";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { validateParams } from "@/middleware/validateParam";
import { Router } from "express";
import {
  crearIncidenciaSchema,
  resolverIncidenciaSchema,
  spotIdParamsSchema,
  spotIncidenciaParamsSchema,
} from "futbol-in-core/schemas";
import { IncidenciaController } from "./incidencia.controller";

const router = Router();

// Listar todas las incidencias abiertas (solo admin)
router.get(
  "/incidencias",
  requireAuth,
  responseHandler(IncidenciaController.listarTodasAdmin)
);

// Crear incidencia en un spot (auth)
router.post(
  "/futbolines/:spotId/incidencias",
  requireAuth,
  validateParams(spotIdParamsSchema),
  validate(crearIncidenciaSchema),
  responseHandler(IncidenciaController.crear)
);

// Marcar resuelto / no resuelto (admin)
router.patch(
  "/futbolines/:spotId/incidencias/:id/resolver",
  requireAuth,
  validateParams(spotIncidenciaParamsSchema),
  validate(resolverIncidenciaSchema),
  responseHandler((req) =>
    IncidenciaController.resolver(req.params.spotId, req.params.id, req as any)
  )
);

// Borrar incidencia (admin o creador)
router.delete(
  "/futbolines/:spotId/incidencias/:id",
  requireAuth,
  validateParams(spotIncidenciaParamsSchema),
  responseHandler((req) =>
    IncidenciaController.borrar(req.params.spotId, req.params.id, req as any)
  )
);

export default router;
