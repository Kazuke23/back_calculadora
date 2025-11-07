import { Request, Response, NextFunction } from "express";

const allowedOps = new Set(["add","sub","mul","div","pow","sqrt","percent","fact"]);

export function validateCalcBody(req: Request, res: Response, next: NextFunction) {
  const { op, a, b } = req.body || {};
  if (!allowedOps.has(op)) {
    return res.status(400).json({ ok: false, error: "Operación inválida" });
  }

  const isUnary = op === "sqrt" || op === "fact";
  if (typeof a !== "number" || !Number.isFinite(a)) {
    return res.status(400).json({ ok: false, error: "'a' debe ser número" });
  }
  if (!isUnary && (typeof b !== "number" || !Number.isFinite(b))) {
    return res.status(400).json({ ok: false, error: "'b' debe ser número" });
  }
  next();
}

export function validateCalcQueryAndParams(req: Request, res: Response, next: NextFunction) {
  const op = req.params.op;
  if (!allowedOps.has(op)) {
    return res.status(400).json({ ok: false, error: "Operación inválida" });
  }

  const isUnary = op === "sqrt" || op === "fact";
  const a = Number(req.query.a);
  const b = req.query.b !== undefined ? Number(req.query.b) : undefined;

  if (!Number.isFinite(a)) {
    return res.status(400).json({ ok: false, error: "'a' debe ser número" });
  }
  if (!isUnary && !Number.isFinite(b as number)) {
    return res.status(400).json({ ok: false, error: "'b' debe ser número" });
  }
  next();
}
