import { Currency } from "../models";
import type { Currency as CurrencyType } from "../interfaces";

class CurrencyService {
	static async findById(id: number) {
		if (!id) {
			return {
				message: "Currency is required",
				success: false,
			};
		}
		try {
			const currency = await Currency.findByPk(id);

			if (!currency) {
				return {
					message: "Currency not found",
					success: false,
				};
			}

			return {
				currency,
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
			const currencies = await Currency.findAll();

			if (!currencies) {
				return {
					message: "Currencies not found",
					success: false,
				};
			}

			return {
				currencies,
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

	static async create({ name, code, symbol, country, exchange_rate, is_main }: CurrencyType) {
		try {
			const currency = await Currency.create({
				name,
				code,
				symbol,
				country,
				exchange_rate,
				is_main,
			});

			return {
				message: "Currency created successfully",
				currency,
				success: true,
			};
		} catch (error) {
			console.error("Error while creating currency:", error);
			return {
				message: "Failed to create currency",
				error,
				success: false,
			};
		}
	}
}

export default CurrencyService;
