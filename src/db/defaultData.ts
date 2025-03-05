import { DEFAULT_USER_PASSWORD, DEFAULT_USER_EMAIL } from "../config";
import { hashPassword } from "../utils/passwordUtils";

interface DefaultUserData {
	username: string;
	first_name: string;
	email: string;
	password: string;
}

export const generateDefaultUserData = async (): Promise<DefaultUserData> => {
	const hashedPassword = await hashPassword(DEFAULT_USER_PASSWORD as string);

	return {
		username: "admin",
		first_name: "admin",
		email: DEFAULT_USER_EMAIL as string,
		password: hashedPassword,
	};
};
