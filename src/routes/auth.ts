import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { registrationValidation, loginValidation } from "../utils/validators";

const router = Router();

router.post("/auth/registration", ...registrationValidation(), AuthController.registration);

router.post("/auth/login", ...loginValidation(), AuthController.login);

router.get("/auth/logout", AuthController.logout);

router.get("/auth/refresh-token", AuthController.refreshAccessToken);

router.get("/auth/check-role", AuthController.checkRole);

export default router;
