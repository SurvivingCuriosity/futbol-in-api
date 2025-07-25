import { Router } from "express";
import { responseHandler } from "@/middleware";
import { FutbolinController } from "./futbolin.controller";
import { agregarFutbolinSchema } from "futbol-in-core/schemas";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/auth";

const router = Router();

router.get("/futbolines", responseHandler(FutbolinController.getAll));

router.post(
  "/futbolines/agregar",
  requireAuth,
  validate(agregarFutbolinSchema),
  responseHandler(FutbolinController.agregarFutbolin)
);

export default router;
