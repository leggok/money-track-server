import bcrypt from "bcrypt";

// Генерація випадкової солі
export const generateSalt = (rounds: number = 10): Promise<string> => {
	return bcrypt.genSalt(rounds); // Асинхронна версія
};

// Хешування паролю
export async function hashPassword(password: string): Promise<string> {
	const salt = await generateSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}

// Порівняння паролю з хешованим паролем
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
	const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
	return isMatch;
}

// Валідність паролю (наприклад, довжина, наявність цифр, літер і спецсимволів)
export function validatePassword(password: string): boolean {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumbers = /[0-9]/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}
