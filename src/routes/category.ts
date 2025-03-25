import { Router } from "express"; // переконайтесь, що Router імпортується, а не express
import { CategoriesController } from "../controllers/CategoriesController";

const router = Router(); // використовуйте Router()

// Створіть маршрути для вашого роутера
router.post("/categories", CategoriesController.create);

router.get("/categories", CategoriesController.getAll);

export default router;
