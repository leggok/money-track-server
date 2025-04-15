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
		await UserService.create(userData.first_name, userData.last_name, userData.username, userData.email, userData.password, userData.refresh_token);
		console.log("Default user created.");
	} catch (error) {
		console.error("Error while creating default users:", error);
	}
}

export async function createDefaultCurrencies() {
	try {
		const currency = {
			name: "United States Dollar",
			code: "USD",
			symbol: "$",
			country: "United States",
			exchange_rate: 1.0,
			is_main: true,
		};
		await CurrencyService.create(currency);
		console.log("Default currencies created.");
	} catch (error) {
		console.error("Error while creating default currencies:", error);
	}
}

export async function createDefaultCategories() {
	try {
		const category = {
			title: "Food",
			icon: "",
			color: "#FF5733",
		};
		await CategoryService.create(category.title, category.icon, category.color);
		console.log("Default categories created.");
	} catch (error) {
		console.error("Error while creating default categories:", error);
	}
}
