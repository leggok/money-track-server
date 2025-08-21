import { Router } from "express"; // переконайтесь, що Router імпортується, а не express
import { CategoriesController } from "../controllers/CategoriesController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router(); // використовуйте Router()

// Створіть маршрути для вашого роутера

router.post("/categories", authMiddleware, CategoriesController.create);

router.get("/categories", authMiddleware, CategoriesController.getAll);

export default router;
