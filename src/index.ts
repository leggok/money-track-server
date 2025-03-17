import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./config";
import { connectPostgres, sequelize } from "./db/postgres";
import { isTableExistAndNotEmpty, createDefaultData } from "./helpers/dbHelpers";

import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category";

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
	cors({
		credentials: true,
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, origin); // Allow the origin
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept"],
	})
);

const router = Router();

router.use(authRoutes);
router.use(categoryRoutes);

app.use("/api", router);

(async () => {
	try {
		console.log("Starting server...");

		await connectPostgres();
		const usersTableExist = await isTableExistAndNotEmpty("Users");

		if (!usersTableExist) {
			await createDefaultData();
		}

		const categoriesTableExist = await isTableExistAndNotEmpty("Categories");

		if (!categoriesTableExist) {
			await createDefaultData();
		}

		await sequelize.sync({ alter: true });
		console.log("PostgreSQL tables synchronized!");

		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error during server initialization:", error);
	}
})();
