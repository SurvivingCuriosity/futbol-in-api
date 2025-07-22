import { Router } from "express";
import { responseHandler } from "@/middleware";
import { getAll } from "@/controllers/futbolin.controller";

const router = Router();

router.get("/futbolines", responseHandler(getAll));

export default router;
