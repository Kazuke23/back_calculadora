import { Router } from "express";
import {
  search, getById, deleteById, deleteAllRecords
} from "../controllers/record.controller";

const router = Router();

// Listar
router.get("/", search);

// Obtener por ID
router.get("/:id", getById);

// Eliminar por ID (sin auth, como pediste)
router.delete("/:id", deleteById);

// (Opcional) Eliminar todo
router.delete("/", deleteAllRecords);

export default router;
