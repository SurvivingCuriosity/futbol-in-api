
import { responseHandler } from "@/middleware";
import { validate } from "@/middleware/validate";
import { loginSchema } from "futbol-in-core/schemas";
import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/auth/login",
  validate(loginSchema),
  responseHandler(AuthController.login)
);

export default router;
