import { responseHandler } from "@/middleware";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { validateParams } from "@/middleware/validateParam";
import { Router } from "express";
import {
  crearIncidenciaSchema,
  incidenciaIdParamsSchema,
  resolverIncidenciaSchema,
  spotIdParamsSchema,
} from "futbol-in-core/schemas";
import { IncidenciaController } from "./incidencia.controller";

const router = Router();

// Crear incidencia (auth)
router.post(
  "/incidencias",
  requireAuth,
  validate(crearIncidenciaSchema),
  responseHandler(IncidenciaController.crear)
);

// Listar todas (admin; check en service)
router.get(
  "/incidencias",
  requireAuth,
  responseHandler(IncidenciaController.listarTodas)
);

// Listar incidencias por futbolín (público)
router.get(
  "/incidencias/spot/:spotId",
  validateParams(spotIdParamsSchema),
  responseHandler((req) =>
    IncidenciaController.listarPorFutbolin(req.params.spotId)
  )
);

// Marcar resuelto / no resuelto (admin)
router.patch(
  "/incidencias/:id/resolver",
  requireAuth,
  validateParams(incidenciaIdParamsSchema),
  validate(resolverIncidenciaSchema),
  responseHandler((req) =>
    IncidenciaController.resolver(req.params.id, req as any)
  )
);

// Borrar (admin o creador)
router.delete(
  "/incidencias/:id",
  requireAuth,
  validateParams(incidenciaIdParamsSchema),
  responseHandler((req) =>
    IncidenciaController.borrar(req.params.id, req as any)
  )
);

export default router;
