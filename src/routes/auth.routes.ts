import { loginController } from "@/controllers/login.controller";
import { responseHandler } from "@/middleware";
import { validate } from "@/middleware/validate";
import { loginSchema } from "futbol-in-core/schemas";
import { Router } from "express";

const router = Router();

router.post(
  "/auth/login",
  validate(loginSchema),
  responseHandler(loginController)
);

export default router;
