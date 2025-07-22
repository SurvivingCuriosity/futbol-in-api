import { Router } from "express";
import authRoutes from "./auth.routes";
import futbolinRouter from "./futbolin.routes";
import healthRouter from "./health.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/", healthRouter);
router.use("/", futbolinRouter);
router.use("/", authRoutes);
router.use("/", userRoutes);

export default router;
