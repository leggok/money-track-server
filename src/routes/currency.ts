import { Router } from "express";
import { CurrenciesController } from "../controllers/CurrenciesController";

const router = Router();

router.get("/currencies", CurrenciesController.getAll);

export default router;
