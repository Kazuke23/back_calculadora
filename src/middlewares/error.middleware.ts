import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || 400; // muchos errores aquí son de validación/negocio
  const payload: Record<string, unknown> = {
    ok: false,
    error: err?.message || "Error interno"
  };
  if (process.env.NODE_ENV !== "production" && err?.stack) {
    payload.stack = err.stack;
  }
  res.status(status >= 400 && status < 600 ? status : 500).json(payload);
}
