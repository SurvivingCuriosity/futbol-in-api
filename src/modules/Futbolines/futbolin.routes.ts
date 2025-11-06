import { responseHandler } from "@/middleware";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { validateParams } from "@/middleware/validateParam";
import { Router } from "express";
import { editarFutbolinSchema, agregarFutbolinSchema } from "futbol-in-core/schemas";
import z from "zod";
import { FutbolinController } from "./futbolin.controller";

const router = Router();

router.get("/futbolines", responseHandler(FutbolinController.getAll));

router.get(
  "/futbolines/ciudad/:ciudad",
  validateParams(z.object({ ciudad: z.string() })),
  responseHandler(FutbolinController.getInCiudad)
);

router.get(
  "/futbolines/marca/:marca",
  validateParams(z.object({ marca: z.string() })),
  responseHandler(FutbolinController.getFutbolinesPorMarca)
);

router.post(
  "/futbolines/agregar",
  requireAuth,
  validate(agregarFutbolinSchema),
  responseHandler(FutbolinController.agregarFutbolin)
);

router.delete(
  "/futbolines/:id",
  requireAuth,
  validateParams(z.object({ id: z.string() })),
  responseHandler(FutbolinController.borrarFutbolin)
)

router.patch(
  "/futbolines/:id",
  requireAuth,
  validateParams(z.object({ id: z.string() })),
  validate(editarFutbolinSchema),
  responseHandler(FutbolinController.editar)
)

export default router;
