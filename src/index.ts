import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { PORT, PATH_TO_UPLOADS_FOLDER } from "./config";
import { connectPostgres, sequelize } from "./db/postgres";
import { isTableExistAndNotEmpty, createDefaultData } from "./helpers/dbHelpers";
import "./models/associations";

import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category";
import uploadRoutes from "./routes/upload";
import transactionRoutes from "./routes/transaction";
import currencyRoutes from "./routes/currency";
import userRoutes from "./routes/user";

import { createDefaultUsers, createDefaultCurrencies, createDefaultCategories } from "./db/defaultData";

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
router.use(uploadRoutes);
router.use(transactionRoutes);
router.use(currencyRoutes);
router.use(userRoutes);

app.use("/api", router);

(async () => {
	try {
		console.log("🚀 Starting Money Track Server...");

		// Створення папки для завантажень
		const uploadsDir = path.resolve(PATH_TO_UPLOADS_FOLDER);
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
			console.log("📁 Created uploads directory");
		}

		// Підключення до бази даних
		await connectPostgres();
		
		// Синхронізація таблиць
		await sequelize.sync({ alter: true });
		console.log("✅ PostgreSQL tables synchronized!");

		// Створення даних за замовчуванням
		console.log("📊 Checking and creating default data...");
		
		const tablesToCheck = [
			{ name: "Users", createFn: createDefaultUsers, description: "Default users" },
			{ name: "Currencies", createFn: createDefaultCurrencies, description: "Default currencies" },
			{ name: "Categories", createFn: createDefaultCategories, description: "Default categories" },
		];

		for (const { name, createFn, description } of tablesToCheck) {
			console.log(`\n🔍 Checking ${description}...`);
			const tableExists = await isTableExistAndNotEmpty(name);
			if (!tableExists) {
				console.log(`📝 Creating ${description}...`);
				await createFn();
			} else {
				console.log(`✅ ${description} already exist.`);
			}
		}

		console.log("\n🎉 Server initialization completed successfully!");

		app.listen(PORT, () => {
			console.log(`🌐 Server started on port ${PORT}`);
			console.log(`📋 API available at http://localhost:${PORT}/api`);
			console.log(`\n📖 Default user credentials:`);
			console.log(`   Email: admin@example.com`);
			console.log(`   Password: admin123`);
		});
	} catch (error) {
		console.error("❌ Error during server initialization:", error);
		process.exit(1);
	}
})();
