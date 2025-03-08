import User from "../models/User";
import { hashPassword } from "../utils/passwordUtils";

class UserService {
	static async findByEmail(email: string) {
		if (!email) {
			return {
				message: "Email is required",
				success: false,
			};
		}
		try {
			const user = await User.findOne({ where: { email } });

			if (!user) {
				return {
					message: "User not found",
					success: false,
				};
			}

			return {
				user,
				success: true,
			};
		} catch (error) {
			console.error("Error in findByEmail", error);
			return {
				message: "Error in findByEmail",
				error,
				success: false,
			};
		}
	}

	static async findById(id: number) {
		if (!id) {
			return {
				message: "ID is required",
				success: false,
			};
		}
		try {
			const user = await User.findByPk(id);

			if (!user) {
				return {
					message: "User not found",
					success: false,
				};
			}

			return {
				user,
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

	static async create(firstName: string, lastName: string, username: string, email: string, password: string) {
		const existUser = await UserService.findByEmail(email);
		if (existUser.success) {
			return {
				message: "User with this email already exists",
				success: false,
			};
		}

		try {
			const hashedPassword = await hashPassword(password);
			const user = await User.create({
				username,
				first_name: firstName,
				last_name: lastName,
				email,
				password: hashedPassword,
			});

			return {
				message: "User created successfully",
				user,
				success: true,
			};
		} catch (error) {
			console.error("Error while creating user:", error);
			return {
				message: "Failed to create user",
				error,
				success: false,
			};
		}
	}
}

export default UserService;
