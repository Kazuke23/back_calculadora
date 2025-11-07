import { Router } from "express";
import calcRoutes from "./calc.routes";
import recordRoutes from "./record.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/calc", calcRoutes);
router.use("/records", recordRoutes);
router.use("/health", healthRoutes);

export default router;
