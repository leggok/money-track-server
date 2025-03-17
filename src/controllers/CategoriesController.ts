import { Request, Response } from "express";
import CategoryService from "../services/CategoryService";

export class CategoriesController {
	static async create(req: Request, res: Response): Promise<any> {
		try {
			const { title, icon, color = "#efefef" } = req.body;

			if (!title) {
				return res.status(400).json({
					message: "Title is required",
					success: false,
				});
			}

			const createdCategory = await CategoryService.create(title, icon, color);

			if (!createdCategory.success) {
				return res.status(400).json({ message: createdCategory.message, success: false });
			}

			return res.status(201).json({
				message: createdCategory.message,
				success: true,
				category: createdCategory.category,
			});
		} catch (error) {
			console.error("Create category error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
