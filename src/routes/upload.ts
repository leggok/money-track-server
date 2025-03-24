import { Router } from "express"; // переконайтесь, що Router імпортується, а не express
import UploadsController from "../controllers/UploadsController";

const router = Router(); // використовуйте Router()

// Створіть маршрути для вашого роутера
router.post("/upload", UploadsController.upload);

export default router;
