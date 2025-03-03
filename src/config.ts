import { config } from "dotenv";

config();

export const PORT = process.env.PORT;
export const JWT_KEY = process.env.JWT_KEY;

export const DB_NAME = process.env.DB_NAME || "money-track";

export const DB_USER = process.env.DB_USER;

export const DB_PASSWORD = process.env.DB_PASSWORD;

export const DB_HOST = process.env.DB_HOST;
