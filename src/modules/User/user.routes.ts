import { responseHandler } from "@/middleware";
import { requireAuth } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { validateQuery } from "@/middleware/validateQuery";
import { UserController } from "@/modules/User/user.controller";
import { Router } from "express";
import { editarUserBodySchema, getFullUserQuerySchema } from "futbol-in-core/schemas";

const router = Router();

router.get(
  "/user/full",
  validateQuery(getFullUserQuerySchema),
  responseHandler(UserController.getFullUserController)
);

router.patch(
  "/user/editar",
  requireAuth,
  validate(editarUserBodySchema),
  responseHandler(UserController.editarUserController)
);

export default router;
