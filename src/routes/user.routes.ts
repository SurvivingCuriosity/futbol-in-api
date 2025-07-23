import { getFullUserController } from "@/controllers/user.controller";
import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { Router } from "express";
import { getFullUserQuerySchema } from "futbol-in-core/schemas";

const router = Router();

router.get(
  "/user/full",
  validateQuery(getFullUserQuerySchema),
  responseHandler(getFullUserController)
);

export default router;
