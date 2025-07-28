import { Request, Response } from "express";
// jwt import removed, handled in AuthService
import UserService from "../services/UsersService";
import { comparePasswords, hashPassword } from "../utils/passwordUtils";
import { UserResponse } from "../interfaces/index";
import { JWT_KEY } from "../config";
import { User } from "../models";
import AuthService from "../services/AuthService";
export class AuthController {
	static async registration(req: Request, res: Response): Promise<any> {
		try {
			const { first_name, last_name, username, email, password } = req.body;

			const newUser = await UserService.create(first_name, last_name, username, email, password);

			if (!newUser.success || !newUser.user) {
				return res.status(400).json({ message: newUser.message, success: false });
			}

			const userId = newUser.user.id;

			if (!JWT_KEY) {
				throw new Error("JWT_KEY is not defined");
			}

			const { success, message, data } = AuthService.generateTokens(userId);

			if (!success || !data) {
				return res.status(400).json({ message, success: false });
			}

			const { accessToken, refresh_token } = data;

			const userToUpdate = await UserService.findById(userId);

			if (!userToUpdate.success || !userToUpdate.user) {
				return res.status(400).json({ message: userToUpdate.message, success: false });
			}

			// Save refresh token
			await userToUpdate.user.update({ refresh_token });

			// Send refresh_token as httpOnly cookie
			res.cookie("refresh_token", refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});

			return res.status(201).json({
				message: "User registered successfully",
				success: true,
				user: {
					id: userId,
					username,
					email,
				},
				accessToken,
			});
		} catch (error) {
			console.error("Registration error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}

	static async login(req: Request, res: Response): Promise<any> {
		try {
			const { email, password } = req.body;

			const result: UserResponse = await UserService.findByEmail(email);

			if (!result.success || !result.user || !result.user.password) {
				return res.status(401).json({
					message: "Invalid credentials",
					success: false,
				});
			}

			const isPasswordMatch = await comparePasswords(password, result.user.password);

			if (!isPasswordMatch) {
				return res.status(401).json({ message: "Invalid credentials", success: false });
			} else {
				const { success: tokenSuccess, message: tokenMsg, data: tokenData } = AuthService.generateTokens(result.user.id);
				if (!tokenSuccess || !tokenData) {
					return res.status(400).json({ message: tokenMsg, success: false });
				}

				const { accessToken, refresh_token } = tokenData;

				await User.update({ refresh_token }, { where: { id: result.user.id } });
				res.cookie("refresh_token", refresh_token, {
					httpOnly: true,
					maxAge: 7 * 24 * 60 * 60 * 1000,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
				});
				res.cookie("access_token", accessToken, {
					httpOnly: true,
					maxAge: 15 * 60 * 1000,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
				});

				const cleanedUser = {
					id: result.user.id,
					firstName: result.user.first_name,
					lastName: result.user.last_name,
					username: result.user.username,
					email: result.user.email,
				};

				return res.status(200).json({
					message: "Login successful",
					success: true,
					user: cleanedUser,
					accessToken,
				});
			}
		} catch (error) {
			console.error("Login error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
