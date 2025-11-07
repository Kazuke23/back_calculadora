import { Request, Response, NextFunction } from "express";
import { compute } from "../services/calc.service";
import { createRecord } from "../repositories/record.repo";

function build(op: string, a: number, b?: number) {
  return { op, a, ...(b !== undefined ? { b } : {}) };
}

export async function calculate(req: Request, res: Response, next: NextFunction) {
  const { op, a, b } = req.body || {};
  try {
    const result = compute(op, a, b);

    await createRecord({
      op: op as any, a, b, result, ok: true,
      meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
    });

    res.json({ ok: true, result, details: build(op, a, b) });
  } catch (err: any) {
    try {
      await createRecord({
        op: op as any, a, b, ok: false, error: err.message,
        meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
      });
    } catch { /* no romper respuesta si falla el guardado */ }

    next(err);
  }
}

export async function calculateByOp(req: Request, res: Response, next: NextFunction) {
  const { op } = req.params;
  const a = Number(req.query.a);
  const b = req.query.b !== undefined ? Number(req.query.b) : undefined;

  try {
    const result = compute(op, a, b);

    await createRecord({
      op: op as any, a, b, result, ok: true,
      meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
    });

    res.json({ ok: true, result, details: build(op, a, b) });
  } catch (err: any) {
    try {
      await createRecord({
        op: op as any, a, b, ok: false, error: err.message,
        meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
      });
    } catch {}

    next(err);
  }
}
