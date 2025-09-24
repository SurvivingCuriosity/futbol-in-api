import { Router } from "express";
import healthRouter from "./modules/_Health/health.routes";
import authRouter from "./modules/Auth/auth.routes";
import futbolinesRoutes from "./modules/Futbolines/futbolin.routes";
import mapRoutes from "./modules/Maps/maps.routes";
import rankingRoutes from "./modules/Ranking/ranking.routes";
import userRoutes from "./modules/User/user.routes";

const router = Router();

router.use("/", healthRouter);
router.use("/", authRouter);
router.use("/", futbolinesRoutes);
router.use("/", mapRoutes);
router.use("/", rankingRoutes);
router.use("/", userRoutes);

export default router;
