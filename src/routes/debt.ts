import { Router } from "express";
import { DebtController } from "../controllers/DebtController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/debt", authMiddleware, DebtController.add);

router.get("/debt", authMiddleware, DebtController.getAll);

export default router;
