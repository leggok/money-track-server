import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from "../config";

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
	throw new Error("Database configuration variables must be defined and not empty");
}
import pkg from "pg";

const { Client } = pkg;

// Типізація для результатів запиту
interface QueryResult {
	rowCount: number | null;
}

const createDatabaseIfNotExists = async (): Promise<void> => {
	const client = new Client({
		user: DB_USER,
		password: DB_PASSWORD,
		host: DB_HOST,
		port: DB_PORT,
		database: "postgres",
	});

	try {
		await client.connect();
		const res: QueryResult = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
		if (res.rowCount === 0) {
			// Створення бази даних з динамічним ім'ям
			await client.query(`CREATE DATABASE ${DB_NAME}`);
			console.log(`Database "${DB_NAME}" created successfully.`);
		} else {
			console.log(`Database "${DB_NAME}" already exists.`);
		}
	} catch (error) {
		console.error("Error creating database:", error);
		process.exit(1);
	} finally {
		await client.end();
	}
};

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "postgres",
	logging: false,
});

export const connectPostgres = async (): Promise<void> => {
	try {
		await createDatabaseIfNotExists();
		await sequelize.authenticate();
		console.log("PostgreSQL connected successfully.");
	} catch (error) {
		console.error("PostgreSQL connection error:", error);
		process.exit(1);
	}
};

// Додатково: обробка завершення процесу для закриття з'єднання
process.on("SIGINT", async () => {
	console.log("Shutting down gracefully...");
	await sequelize.close();
	console.log("PostgreSQL connection closed.");
	process.exit(0);
});
