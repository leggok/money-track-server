import { DEFAULT_USER_PASSWORD, DEFAULT_USER_EMAIL } from "../config";

interface DefaultUserData {
	username: string;
	first_name: string;
	email: string;
	password: string;
}

export const defaultUserData: DefaultUserData = {
	username: "admin",
	first_name: "admin",
	email: DEFAULT_USER_EMAIL as string,
	password: DEFAULT_USER_PASSWORD as string,
};
