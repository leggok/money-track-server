import { config } from "dotenv";

config();

export const PORT = process.env.PORT;
export const JWT_KEY = process.env.JWT_KEY;

export const DB_NAME = process.env.DB_NAME || "money-track";

export const DB_USER = process.env.DB_USER;

export const DB_PASSWORD = process.env.DB_PASSWORD;

export const DB_HOST = process.env.DB_HOST;

export const DB_PORT = Number(process.env.DB_PORT);

export const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD;

export const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL;
