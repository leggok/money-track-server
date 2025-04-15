import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/UsersService";
import { comparePasswords } from "../utils/passwordUtils";
import { UserResponse } from "../interfaces/index";
import { JWT_KEY } from "../config";
export class AuthController {
	static async registration(req: Request, res: Response): Promise<any> {
		try {
			const { firstName, lastName, username, email, password } = req.body;

			if (!firstName) {
				return res.status(400).json({
					message: "First name is required",
					success: false,
				});
			}
			if (!username) {
				return res.status(400).json({
					message: "Username is required",
					success: false,
				});
			}
			if (!email) {
				return res.status(400).json({
					message: "Email is required",
					success: false,
				});
			}
			if (!password) {
				return res.status(400).json({
					message: "Password is required",
					success: false,
				});
			}

			if (!JWT_KEY) {
				throw new Error("JWT_KEY is not defined");
			}

			const refreshToken = jwt.sign({ email: email, password: password }, JWT_KEY);
			const result = await UserService.create(firstName, lastName, username, email, password, refreshToken);

			if (!result.success) {
				return res.status(400).json({ message: result.message, success: false });
			}

			return res.status(201).json({
				message: result.message,
				success: true,
				user: result.user,
			});
		} catch (error) {
			console.error("Registration error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}

	static async login(req: Request, res: Response): Promise<any> {
		try {
			const { email, password } = req.body;

			if (!email) {
				return res.status(400).json({
					message: "Email is required",
					success: false,
				});
			}
			if (!password) {
				return res.status(400).json({
					message: "Password is required",
					success: false,
				});
			}

			const result: UserResponse = await UserService.findByEmail(email);

			if (!result.success || !result.user || !result.user.password) {
				return res.status(401).json({
					message: "Invalid credentials",
					success: false,
				});
			}

			const isPasswordMatch = await comparePasswords(password, result.user.password);

			if (isPasswordMatch) {
				res.cookie("refresh_token", result.user.refresh_token, {
					httpOnly: true,
					maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
					secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
					sameSite: "strict",
				});

				if (!JWT_KEY) {
					throw new Error("JWT_KEY is not defined");
				}
				const access_token = jwt.sign({ username: result.user.username, id: result.user.id }, JWT_KEY);

				res.cookie("access_token", access_token, {
					httpOnly: true,
					maxAge: 15 * 60 * 1000, // 15 minutes
					secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
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
				});
			} else {
				return res.status(401).json({
					message: "Invalid credentials",
					success: false,
				});
			}
		} catch (error) {
			console.error("Login error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
