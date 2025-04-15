import { Router } from "express";
import UsersController from "../controllers/UsersController";

const router = Router();

router.get("/users/:user_id/balance", UsersController.getBalance);

export default router;
