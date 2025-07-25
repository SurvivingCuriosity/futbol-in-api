import rankingRouter from "@/modules/Ranking/ranking.routes";
import { Router } from "express";
import authRoutes from "../modules/Auth/auth.routes";
import futbolinRouter from "../modules/Futbolines/futbolin.routes";
import healthRouter from "../modules/_Health/health.routes";
import userRoutes from "../modules/User/user.routes";
import googleMapsRouter from "../modules/Maps/maps.routes";

const router = Router();

router.use("/", healthRouter);
router.use("/", futbolinRouter);
router.use("/", authRoutes);
router.use("/", userRoutes);
router.use("/", rankingRouter);
router.use("/", googleMapsRouter);

export default router;
