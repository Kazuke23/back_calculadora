import { Request, Response, NextFunction } from "express";
import {
  searchRecords,
  getRecordById,
  deleteRecordById,
  deleteAll
} from "../repositories/record.repo";

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { op, from, to, page, limit } = req.query as Record<string, string>;
    const out = await searchRecords({ op, from, to }, { page, limit });
    res.json({ ok: true, ...out });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await getRecordById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, error: "No encontrado" });
    res.json({ ok: true, item: doc });
  } catch (err) { next(err); }
}

export async function deleteById(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await deleteRecordById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, error: "Registro no encontrado" });
    res.json({ ok: true, deletedId: req.params.id });
  } catch (err) { next(err); }
}

export async function deleteAllRecords(_req: Request, res: Response, next: NextFunction) {
  try {
    const out = await deleteAll();
    res.json({ ok: true, ...out });
  } catch (err) { next(err); }
}
