import { getFullUserController } from "@/controllers/user.controller";
import { responseHandler } from "@/middleware";
import { validateQuery } from "@/middleware/validateQuery";
import { getFullUserQuerySchema } from "@/validation/user/getFullUser.validation";
import { Router } from "express";

const router = Router();

router.get(
  "/user/full",
  validateQuery(getFullUserQuerySchema),
  responseHandler(getFullUserController)
);

export default router;
