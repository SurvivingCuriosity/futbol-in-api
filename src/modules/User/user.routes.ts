import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { UserController } from "@/modules/User/user.controller";
import { Router } from "express";
import { getFullUserQuerySchema } from "futbol-in-core/schemas";

const router = Router();

router.get(
  "/user/full",
  validateQuery(getFullUserQuerySchema),
  responseHandler(UserController.getFullUserController)
);

export default router;
