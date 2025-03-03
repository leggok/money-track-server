import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT, DB_NAME } from "./config.js";

const app = express();
const port = PORT;

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

app.get("/", (req: Request, res: Response) => {
	res.send("Hello, world!");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
