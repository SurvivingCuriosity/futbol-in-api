import { Router } from "express";
import { responseHandler } from "@/middleware";
import { FutbolinController } from "./futbolin.controller";
import { agregarFutbolinSchema } from "futbol-in-core/schemas";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/auth";
import { validateQuery } from "@/middleware/validateQuery";
import z from "zod";
import { validateParams } from "@/middleware/validateParam";

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

export default router;
