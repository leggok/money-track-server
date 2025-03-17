import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
// import webp from "webp-converter";

const PATH_TO_UPLOADS_FOLDER = path.resolve(__dirname, "../../uploads");

export default class ImageUploadService {
	static async uploadImage({ filename, extension, base64, type }: { filename: string; extension: string; base64: string; type?: string }) {
		const date = new Date();

		// Визначаємо папку для збереження файлу
		let uploadPath;
		if (!type || type === "post") {
			uploadPath = `${PATH_TO_UPLOADS_FOLDER}/posts/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
		} else if (type === "coin") {
			uploadPath = `${PATH_TO_UPLOADS_FOLDER}/coins`;
		} else if (type === "platform") {
			uploadPath = `${PATH_TO_UPLOADS_FOLDER}/platforms`;
		} else if (type === "users") {
			uploadPath = `${PATH_TO_UPLOADS_FOLDER}/users`;
		} else if (type === "threads") {
			uploadPath = `${PATH_TO_UPLOADS_FOLDER}/threads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
		} else {
			uploadPath = `${PATH_TO_UPLOADS_FOLDER}/misc`;
		}

		// Переконуємось, що директорія існує
		if (!fs.existsSync(uploadPath)) {
			await fsPromises.mkdir(uploadPath, { recursive: true });
		}

		// Валідація вхідних даних
		if (!filename || !extension || !base64) {
			throw new Error("Missing parameters");
		}

		// Генеруємо унікальну назву, якщо файл уже існує
		let filePath = `${uploadPath}/${filename}.${extension}`;
		let index = 1;
		while (fs.existsSync(filePath)) {
			filePath = `${uploadPath}/${filename}-${index}.${extension}`;
			index++;
		}

		// Збереження файлу
		await fsPromises.writeFile(filePath, base64, "base64");

		// Конвертація в WebP
		const webpPath = `${filePath}.webp`;
		// await webp.cwebp(filePath, webpPath, "-q 90 -m 6");

		// Формуємо URL файлу
		const fileUrl = filePath.substring(filePath.indexOf("/uploads"));

		return {
			message: "Success",
			success: true,
			file: { url: fileUrl },
		};
	}
}
