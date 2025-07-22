import { loginController } from "@/controllers/login.controller";
import { responseHandler } from "@/middleware";
import { validate } from "@/middleware/validate";
import { loginSchema } from "@/validation/auth/login.validation";
import { Router } from "express";

const router = Router();

router.post(
  "/auth/login",
  validate(loginSchema),
  responseHandler(loginController)
);

export default router;
