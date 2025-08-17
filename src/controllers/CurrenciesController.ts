import { Request, Response } from "express";
import CurrencyService from "../services/CurrencyService";

export class CurrenciesController {
	static async getAll(req: Request, res: Response): Promise<any> {
		try {
			const { update } = req.query;

			if (update === "true") {
				const currency = await CurrencyService.update();
				if (!currency.success) {
					return res.status(400).json({ message: currency.message, success: false });
				}
			}

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

	static async update(req: Request, res: Response): Promise<any> {
		try {
			const currency = await CurrencyService.update();

			if (!currency.success) {
				return res.status(400).json({ message: currency.message, success: false });
			}

			return res.status(201).json({ message: currency.message, success: true });
		} catch (error) {
			console.error("Update currency error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}

	static async updateMainCurrencyForUser(req: Request, res: Response): Promise<any> {
		try {
			const { currency_id, user_id } = req.body;
			const currency = await CurrencyService.updateMainCurrencyForUser(currency_id, user_id);

			if (!currency.success) {
				return res.status(400).json({ message: currency.message, success: false });
			}

			return res.status(201).json({ message: currency.message, success: true });
		} catch (error) {
			console.error("Update main currency error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
