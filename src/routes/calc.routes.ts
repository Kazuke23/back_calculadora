import { Router } from "express";
import { calculate, calculateByOp } from "../controllers/calc.controller";
import { validateCalcBody, validateCalcQueryAndParams } from "../middlewares/validate.middleware";


const router = Router();

router.post("/", validateCalcBody, calculate);
router.get("/:op", validateCalcQueryAndParams, calculateByOp);

export default router;
