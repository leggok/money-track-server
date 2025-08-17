import { DEFAULT_USER_PASSWORD, DEFAULT_USER_EMAIL } from "../config";
import { hashPassword } from "../utils/passwordUtils";
import UserService from "../services/UsersService";
import CurrencyService from "../services/CurrencyService";
import CategoryService from "../services/CategoryService";

interface DefaultUserData {
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	refresh_token: string;
}

export const generateDefaultUserData = async (): Promise<DefaultUserData> => {
	const hashedPassword = await hashPassword(DEFAULT_USER_PASSWORD as string);

	return {
		username: "admin",
		first_name: "admin",
		last_name: "",
		email: DEFAULT_USER_EMAIL as string,
		password: hashedPassword,
		refresh_token: "",
	};
};

export async function createDefaultUsers() {
	try {
		const userData = await generateDefaultUserData();
		const result = await UserService.create(
			userData.first_name, 
			userData.last_name, 
			userData.username, 
			userData.email, 
			userData.password
		);
		
		if (result.success) {
			console.log("✅ Default user created successfully.");
		} else {
			console.log("ℹ️ Default user already exists or error occurred:", result.message);
		}
	} catch (error) {
		console.error("❌ Error while creating default users:", error);
	}
}

export async function createDefaultCurrencies() {
	try {
		const currencies = [
			{
				name: "United States Dollar",
				code: "USD",
				symbol: "$",
				country: "United States",
				is_main: true,
			},
			{
				name: "Euro",
				code: "EUR",
				symbol: "€",
				country: "European Union",
				is_main: false,
			},
			{
				name: "Ukrainian Hryvnia",
				code: "UAH",
				symbol: "₴",
				country: "Ukraine",
				is_main: false,
			}
		];

		for (const currency of currencies) {
			const result = await CurrencyService.create(currency);
			if (result.success) {
				console.log(`✅ Currency ${currency.code} created successfully.`);
			} else {
				console.log(`ℹ️ Currency ${currency.code} already exists or error occurred:`, result.message);
			}
		}
	} catch (error) {
		console.error("❌ Error while creating default currencies:", error);
	}
}

export async function createDefaultCategories() {
	try {
		const categories = [
			{
				title: "Food",
				icon: "🍕",
				color: "#FF5733",
			},
			{
				title: "Transport",
				icon: "🚗",
				color: "#33FF57",
			},
			{
				title: "Shopping",
				icon: "🛍️",
				color: "#3357FF",
			},
			{
				title: "Entertainment",
				icon: "🎬",
				color: "#F033FF",
			},
			{
				title: "Health",
				icon: "🏥",
				color: "#FF3333",
			},
			{
				title: "Education",
				icon: "📚",
				color: "#33FFF3",
			},
			{
				title: "Salary",
				icon: "💰",
				color: "#33FF33",
			},
			{
				title: "Investment",
				icon: "📈",
				color: "#FFD700",
			}
		];

		for (const category of categories) {
			const result = await CategoryService.create(category.title, category.icon, category.color);
			if (result.success) {
				console.log(`✅ Category "${category.title}" created successfully.`);
			} else {
				console.log(`ℹ️ Category "${category.title}" already exists or error occurred:`, result.message);
			}
		}
	} catch (error) {
		console.error("❌ Error while creating default categories:", error);
	}
}
