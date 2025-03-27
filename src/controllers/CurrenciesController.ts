import { Request, Response } from "express";
import CurrencyService from "../services/CurrencyService";

export class CurrenciesController {
	static async getAll(req: Request, res: Response): Promise<any> {
		try {
			const currencies = await CurrencyService.findAll();

			if (!currencies.success) {
				return res.status(400).json({ message: currencies.message, success: false });
			}

			return res.status(201).json({
				message: currencies.message,
				success: true,
				currencies: currencies.currencies,
			});
		} catch (error) {
			console.error("Get all currencies error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
