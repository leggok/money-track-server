import { Currency, User } from "../models";
import type { Currency as CurrencyType, UserType } from "../interfaces";
import axios from "axios";
import { CURRENCY_API_KEY } from "../config";
import CurrencyHistory from "../models/CurrencyHistory";
import { Model, Sequelize } from "sequelize";

type CurrencyInstance = Model & CurrencyType;
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
			const currencies = await Currency.findAll({
				attributes: [
				  "id", "name", "code", "symbol", "country", "is_main",
				  [
					Sequelize.literal(`(
					  SELECT ch.exchange_rate
					  FROM currency_histories ch
					  WHERE ch.currency_id = currency.id
					  ORDER BY ch.date DESC
					  LIMIT 1
					)`),
					"currency_value"
				  ],
				  [
					Sequelize.literal(`(
					  SELECT ch.date
					  FROM currency_histories ch
					  WHERE ch.currency_id = currency.id
					  ORDER BY ch.date DESC
					  LIMIT 1
					)`),
					"currency_date"
				  ]
				],
			  });
			  
			  
			  
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

	static async create({ name, code, symbol, country, is_main }: CurrencyType) {
		try {
			const currency = await Currency.create({
				name,
				code,
				symbol,
				country,
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

	static async update() {
		try {
			const currencies = await Currency.findAll() as CurrencyInstance[];
			const res = await axios.get(`https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`);
			for (const currency of currencies) {
				const currencyRate = res.data.conversion_rates[currency.code];
				await CurrencyHistory.create({ currency_id: currency.id, date: new Date(), exchange_rate: currencyRate });
			}
			return {
				message: "Currencies updated successfully",
				success: true,
			};
		} catch (error) {
			console.error("Error while updating currency:", error);
			return {
				message: "Failed to update currency",
				error,
				success: false,
			};
		}
	}

	static async updateMainCurrencyForUser(currency_id: number, user_id: number) {
		try {
			const user = await User.findByPk(user_id);
			if (!user) {
				return {
					message: "User not found",
					success: false,
				};
			}
			const userData = user.get({ plain: true }) as UserType;
			userData.main_currency_id = currency_id;	
			await User.update(userData, { where: { id: user_id } });

			const currency = await Currency.findByPk(currency_id);
			if (!currency) {
				return {
					message: "Currency not found",
					success: false,
				};
			}
			const currencyData = currency.get({ plain: true }) as CurrencyType;
			currencyData.is_main = true;
			await Currency.update(currencyData, { where: { id: userData.main_currency_id } });

			return {
				message: "Main currency updated successfully",
				success: true,
			};
		} catch (error) {
			console.error("Error while updating main currency for user:", error);
			return {
				message: "Failed to update main currency for user",
				error,
				success: false,
			};
		}
	}
}

export default CurrencyService;
