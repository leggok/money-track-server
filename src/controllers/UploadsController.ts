import { Request, Response } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import webp from "webp-converter";
import { PATH_TO_UPLOADS_FOLDER } from "../config";

export default class UploadsController {
	static async upload(req: Request, res: Response): Promise<any> {
		const {
			filename,
			extension,
			base64,
			folder = "uploads",
		} = req.body as {
			filename?: string;
			extension?: string;
			base64?: string;
			folder?: string;
		};

		if (!filename || !extension || !base64) {
			return res.status(400).json({
				message: "Missing parameters",
			});
		}

		const path = `${PATH_TO_UPLOADS_FOLDER}/${folder}`;

		// Створення директорії, якщо вона не існує
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true });
		}

		// Генерація унікального імені файлу, якщо воно вже існує
		let filePath = `${path}/${filename}.${extension}`;
		let index = 1;
		while (fs.existsSync(filePath)) {
			filePath = `${path}/${filename}-${index}.${extension}`;
			index++;
		}

		try {
			await fsPromises.writeFile(filePath, base64, "base64");

			// Якщо це не SVG, конвертуємо у WebP
			if (extension !== "svg") {
				await webp.cwebp(filePath, `${filePath}.webp`, "-q 90 -m 6");
			}

			const fileUrl = filePath.substring(filePath.indexOf("/uploads"));

			return res.status(200).json({
				message: "Success",
				success: 1,
				file: {
					url: fileUrl,
				},
			});
		} catch (error) {
			console.error("File upload error:", error);
			return res.status(500).json({
				message: "Internal server error",
			});
		}
	}
}
