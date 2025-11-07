import { Router } from "express";
import { mongoStatus } from "../config/db";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, service: "calculator-api-ts", time: new Date().toISOString() });
});

router.get("/db", (_req, res) => {
  const status = mongoStatus();
  res.json({ ok: status === "connected", mongo: status, time: new Date().toISOString() });
});

export default router;
