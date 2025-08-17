import { Router } from "express";
import { CurrenciesController } from "../controllers/CurrenciesController";

const router = Router();

router.get("/currencies", CurrenciesController.getAll);

router.put("/currencies", CurrenciesController.update);

router.patch("/currencies/update-main-currency-for-user", CurrenciesController.updateMainCurrencyForUser);

export default router;
