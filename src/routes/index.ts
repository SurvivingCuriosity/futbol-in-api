import { Router } from "express";
import authRoutes from "./auth.routes";
import futbolinRouter from "./futbolin.routes";
import healthRouter from "./health.routes";

const router = Router();

router.use("/", healthRouter);
router.use("/", futbolinRouter);
router.use("/", authRoutes);

export default router;
