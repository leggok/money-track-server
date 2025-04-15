import { Request, Response } from "express";
import TransactionService from "../services/TransactionService";

export class TransactionsController {
	static async add(req: Request, res: Response): Promise<any> {
		try {
			const { value, description, category_id, currency_id, type, timestamp, user_id } = req.body;

			if (!value) {
				return res.status(400).json({
					message: "Value is required",
					success: false,
				});
			}

			const createdTransaction = await TransactionService.add({ value, description, category_id, currency_id, type, timestamp, user_id });

			if (!createdTransaction.success) {
				return res.status(400).json({ message: createdTransaction.message, success: false });
			}

			return res.status(201).json({
				message: createdTransaction.message,
				success: true,
				transaction: createdTransaction.transaction,
			});
		} catch (error) {
			console.error("Create transaction error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}

	static async getAll(req: Request, res: Response): Promise<any> {
		try {
			const user_id = Number(req.query.user_id);
			const transactions = await TransactionService.findAllByUserId(user_id);

			if (!transactions.success) {
				return res.status(400).json({ message: transactions.message, success: false });
			}

			return res.status(201).json({
				message: transactions.message,
				success: true,
				transactions: transactions.transactions,
			});
		} catch (error) {
			console.error("Get all transactions error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
