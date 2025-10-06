import { responseHandler } from "@/middleware";
import { validate } from "@/middleware/validate";
import { Router } from "express";
import {
  googleSignInSchema,
  loginSchema,
  registerSchema,
  resendCodeSchema,
  setUsernameSchema,
  verifyEmailSchema,
} from "futbol-in-core/schemas";
import { AuthController } from "./auth.controller";
import { requireAuth } from "@/middleware/auth";

const router = Router();

router.post(
  "/auth/login",
  validate(loginSchema),
  responseHandler(AuthController.login)
);

router.post(
  "/auth/register",
  validate(registerSchema),
  responseHandler(AuthController.register)
);

router.post(
  "/auth/verify-email",
  validate(verifyEmailSchema),
  responseHandler(AuthController.verifyEmail)
);

router.post(
  "/auth/resend-code",
  validate(resendCodeSchema),
  responseHandler(AuthController.resendCode)
);


router.post(
  "/auth/google",
  validate(googleSignInSchema),
  responseHandler(AuthController.googleSignIn)
);

router.post(
  "/auth/set-username",
  requireAuth,
  validate(setUsernameSchema),
  responseHandler(AuthController.setUsername)
);

export default router;
