import { responseHandler } from "@/middleware";
import { requireAuth } from "@/middleware/auth";
import { uploadSingleImage } from "@/middleware/upload";
import { validate } from "@/middleware/validate";
import { validateQuery } from "@/middleware/validateQuery";
import { UserController } from "@/modules/User/user.controller";
import { Router } from "express";
import { CambiarEmailSchema, CambiarPasswordSchema, editarUserBodySchema, getFullUserQuerySchema, UserImageSchema } from "futbol-in-core/schemas";
import z from "zod";

const router = Router();

router.get(
  "/user/full",
  validateQuery(getFullUserQuerySchema),
  responseHandler(UserController.getFullUserController)
);

router.get(
  "/user/byUsername",
  validateQuery(z.object({ username: z.string() })),
  responseHandler(UserController.getFullUserByUsernameController)
);


router.patch(
  "/user/editar",
  requireAuth,
  validate(editarUserBodySchema),
  responseHandler(UserController.editarUserController)
);

router.patch(
  "/user/cambiar-password",
  requireAuth,
  validate(CambiarPasswordSchema),
  responseHandler(UserController.cambiarPassword)
);

router.patch(
  "/user/cambiar-email",
  requireAuth,
  validate(CambiarEmailSchema),
  responseHandler(UserController.cambiarEmail)
);


router.patch(
  "/user/imagen",
  requireAuth,
  uploadSingleImage,
  validate(UserImageSchema),
  responseHandler(UserController.cambiarImagen)
);

export default router;
