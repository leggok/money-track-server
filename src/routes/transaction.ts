import { Router } from "express";
import { TransactionsController } from "../controllers/TransactionsController";

const router = Router();

router.post("/transactions", TransactionsController.add);

router.get("/transactions", TransactionsController.getAll);

export default router;
