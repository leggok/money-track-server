import { Transaction } from "../models";
import type { Transaction as TransactionType } from "../interfaces";

class TransactionService {
	static async findById(id: number) {
		if (!id) {
			return {
				message: "Transaction is required",
				success: false,
			};
		}
		try {
			const transaction = await Transaction.findByPk(id);

			if (!transaction) {
				return {
					message: "Transaction not found",
					success: false,
				};
			}

			return {
				transaction,
				success: true,
			};
		} catch (error) {
			console.error("Error in findById", error);
			return {
				message: "Error in findById",
				error,
				success: false,
			};
		}
	}

	static async findAll() {
		try {
			const transactions = await Transaction.findAll();

			if (!transactions) {
				return {
					message: "Transactions not found",
					success: false,
				};
			}

			return {
				transactions,
				success: true,
			};
		} catch (error) {
			console.error("Error in findAll", error);
			return {
				message: "Error in findAll",
				error,
				success: false,
			};
		}
	}

	static async add({ value, description, category_id, currency_id, type, timestamp }: TransactionType) {
		try {
			const transaction = await Transaction.create({
				value,
				description,
				category_id,
				currency_id,
				type,
				timestamp,
			});

			return {
				message: "Transaction created successfully",
				transaction,
				success: true,
			};
		} catch (error) {
			console.error("Error while creating transaction:", error);
			return {
				message: "Failed to create transaction",
				error,
				success: false,
			};
		}
	}
}

export default TransactionService;
