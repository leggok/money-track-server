import { User } from "../models";
import { hashPassword } from "../utils/passwordUtils";
import { UserType } from "../interfaces/User";
import { CreateUserResponse } from "../interfaces/Responses";

class UserService {
	static async findByEmail(email: string) {
		if (!email) {
			return {
				message: "Email is required",
				success: false,
			};
		}
		try {
			const user = (await User.findOne({ where: { email } })) as UserType | null;

			if (!user) {
				return {
					message: "User not found",
					success: false,
				};
			}

			console.log("user", user);

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

	static async findByEmailAndRefreshToken(email: string, refresh_token: string) {
		if (!email || !refresh_token) {
			return {
				message: "Email and refresh token are required",
				success: false,
			};
		}
		try {
			const user = await User.findOne({ 
				where: { 
					email, 
					refresh_token 
				} 
			}) as UserType | null;

			if (!user) {
				return {
					message: "User not found or invalid refresh token",
					success: false,
				};
			}

			return {
				user,
				success: true,
			};
		} catch (error) {
			console.error("Error in findByEmailAndRefreshToken", error);
			return {
				message: "Error in findByEmailAndRefreshToken",
				error,
				success: false,
			};
		}
	}

	static async updateRefreshToken(userId: number, refresh_token: string) {
		if (!userId || !refresh_token) {
			return {
				message: "User ID and refresh token are required",
				success: false,
			};
		}
		try {
			const user = await User.findByPk(userId);
			
			if (!user) {
				return {
					message: "User not found",
					success: false,
				};
			}

			await user.update({ refresh_token });

			return {
				message: "Refresh token updated successfully",
				success: true,
			};
		} catch (error) {
			console.error("Error in updateRefreshToken", error);
			return {
				message: "Error updating refresh token",
				error,
				success: false,
			};
		}
	}

	static async clearRefreshToken(userId: number) {
		if (!userId) {
			return {
				message: "User ID is required",
				success: false,
			};
		}
		try {
			const user = await User.findByPk(userId);
			
			if (!user) {
				return {
					message: "User not found",
					success: false,
				};
			}

			await user.update({ refresh_token: null });

			return {
				message: "Refresh token cleared successfully",
				success: true,
			};
		} catch (error) {
			console.error("Error in clearRefreshToken", error);
			return {
				message: "Error clearing refresh token",
				error,
				success: false,
			};
		}
	}

	static async create(first_name: string, last_name: string, username: string, email: string, password: string, main_currency_id: number = 1): Promise<CreateUserResponse> {
		const existUser = await UserService.findByEmail(email);

		if (existUser.success) {
			return {
				message: "User with this email already exists",
				success: false,
				user: null,
			};
		}

		try {
			const hashedPassword = await hashPassword(password);

			const user = (
				await User.create({
					username,
					first_name,
					last_name,
					email,
					password: hashedPassword,
					main_currency_id,
				})
			).get({ plain: true }) as UserType;

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
				user: null,
			};
		}
	}

	static async updateTotalBudget(user_id: number, value: number, type: "income" | "expense") {
		try {
			const userInstance = await User.findByPk(user_id);
			if (!userInstance) throw new Error("User not found");

			// Якщо потрібно: отримаємо чистий об'єкт без методів:
			const user: UserType = userInstance.get({ plain: true });
			const currentBudget = Number(user.total_budget);
			const transactionValue = Number(value);
			let newBudget: number;

			if (type === "income") {
				newBudget = currentBudget + transactionValue;
			} else {
				newBudget = currentBudget - transactionValue;
			}

			await userInstance.update({ total_budget: newBudget });

			return {
				message: "Total budget updated successfully",
				success: true,
				user: {
					...user,
					total_budget: newBudget,
				},
			};
		} catch (error) {
			console.error("Error updating total budget:", error);
			return {
				message: "Failed to update total budget",
				error,
				success: false,
			};
		}
	}

	static async getBalance(user_id: number) {
		const userInstance = await User.findByPk(user_id);
		if (!userInstance) throw new Error("User not found");

		const user: UserType = userInstance.get({ plain: true });

		return {
			message: "Total budget getted successfully",
			success: true,
			balance: user.total_budget,
		};
	}
}

export default UserService;
