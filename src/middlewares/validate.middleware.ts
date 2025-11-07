import { Request, Response, NextFunction } from "express";

// Solo 4 operaciones básicas
const allowedOps = new Set(["add", "sub", "mul", "div"]);

function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

export function validateCalcBody(req: Request, res: Response, next: NextFunction) {
  const { op } = req.body || {};
  const a = Number(req.body?.a);
  const b = Number(req.body?.b);

  if (!allowedOps.has(op)) {
    return res.status(400).json({ ok: false, error: "Operación inválida. Use: add, sub, mul, div" });
  }
  if (!isFiniteNumber(a)) {
    return res.status(400).json({ ok: false, error: "'a' debe ser un número finito" });
  }
  if (!isFiniteNumber(b)) {
    return res.status(400).json({ ok: false, error: "'b' debe ser un número finito" });
  }

  // Normalizamos a números
  (req as any).calc = { op, a, b };
  next();
}

export function validateCalcQueryAndParams(req: Request, res: Response, next: NextFunction) {
  const op = req.params.op;
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (!allowedOps.has(op)) {
    return res.status(400).json({ ok: false, error: "Operación inválida. Use: add, sub, mul, div" });
  }
  if (!Number.isFinite(a)) {
    return res.status(400).json({ ok: false, error: "'a' debe ser un número finito" });
  }
  if (!Number.isFinite(b)) {
    return res.status(400).json({ ok: false, error: "'b' debe ser un número finito" });
  }

  (req as any).calc = { op, a, b };
  next();
}
