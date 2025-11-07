import { Request, Response, NextFunction } from "express";
import { computeDecimal } from "../services/calc.service";
import { createRecord } from "../repositories/record.repo";

function details(op: string, a: number, b: number) {
  return { op, a, b };
}

/**
 * Precisión de salida en división (número de decimales).
 * Ajusta a tu gusto (6, 8, 10, etc.).
 */
const DIV_PRECISION = 8;

export async function calculate(req: Request, res: Response, next: NextFunction) {
  const { op, a, b } = (req as any).calc || req.body || {};
  try {
    const result = computeDecimal(op, a, b, DIV_PRECISION);

    await createRecord({
      op, a, b, result, ok: true,
      meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
    });

    res.json({ ok: true, result, details: details(op, a, b) });
  } catch (err: any) {
    try {
      await createRecord({
        op, a, b, ok: false, error: err?.message,
        meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
      });
    } catch {}
    next(err);
  }
}

export async function calculateByOp(req: Request, res: Response, next: NextFunction) {
  const { op, a, b } = (req as any).calc || {};
  try {
    const result = computeDecimal(op, a, b, DIV_PRECISION);

    await createRecord({
      op, a, b, result, ok: true,
      meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
    });

    res.json({ ok: true, result, details: details(op, a, b) });
  } catch (err: any) {
    try {
      await createRecord({
        op, a, b, ok: false, error: err?.message,
        meta: { ip: req.ip, userAgent: req.get("user-agent") || undefined }
      });
    } catch {}
    next(err);
  }
}
