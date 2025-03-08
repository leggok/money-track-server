import { Router } from "express"; // переконайтесь, що Router імпортується, а не express
import { AuthController } from "../controllers/AuthController";

const router = Router(); // використовуйте Router()

// Створіть маршрути для вашого роутера
router.post("/auth/registration", AuthController.registration);

router.post("/auth/login", AuthController.login);

export default router;
