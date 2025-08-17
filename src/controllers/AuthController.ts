import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/UsersService";
import { comparePasswords } from "../utils/passwordUtils";
import { UserResponse } from "../interfaces/index";
import { JWT_KEY, ACCESS_TTL } from "../config";
import AuthService from "../services/AuthService";
import { verifyJwt } from "../utils/jwtUtils";

interface JwtClaims {
	id: number;
	username: string;
	email: string;
}

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

			// Оновлюємо refresh token в базі даних
			const updateResult = await UserService.updateRefreshToken(userId, refresh_token);

			if (!updateResult.success) {
				return res.status(400).json({ message: updateResult.message, success: false });
			}

			// Відправляємо refresh_token як httpOnly cookie
			res.cookie("refresh_token", refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
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
			}

			const { success: tokenSuccess, message: tokenMsg, data: tokenData } = AuthService.generateTokens(result.user.id);
			
			if (!tokenSuccess || !tokenData) {
				return res.status(400).json({ message: tokenMsg, success: false });
			}

			const { accessToken, refresh_token } = tokenData;

			// Оновлюємо refresh token в базі даних
			const updateResult = await UserService.updateRefreshToken(result.user.id, refresh_token);
			
			if (!updateResult.success) {
				return res.status(400).json({ message: updateResult.message, success: false });
			}

			// Встановлюємо cookies
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
				main_currency_id: result.user.main_currency_id,
			};

			return res.status(200).json({
				message: "Login successful",
				success: true,
				user: cleanedUser,
				accessToken,
			});
		} catch (error) {
			console.error("Login error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}

	static async refreshAccessToken(req: Request, res: Response): Promise<any> {
		try {
			const refresh_token = req.cookies["refresh_token"];

			if (!refresh_token) {
				return res.status(401).json({ message: "Not authenticated" });
			}

			let claims: JwtClaims;
			try {
				claims = verifyJwt(refresh_token) as JwtClaims;
			} catch (err) {
				res.clearCookie("refresh_token");
				res.clearCookie("access_token");
				return res.status(401).json({ message: "Invalid or expired refresh token" });
			}

			// Використовуємо новий метод з UsersService
			const userResult = await UserService.findByEmailAndRefreshToken(claims.email, refresh_token);

			if (!userResult.success || !userResult.user) {
				res.clearCookie("refresh_token");
				res.clearCookie("access_token");
				return res.status(404).json({ message: userResult.message });
			}

			const user = userResult.user;

			// Перевіряємо чи користувач не архівований (якщо поле існує)
			if ('archived' in user && user.archived) {
				res.clearCookie("refresh_token");
				res.clearCookie("access_token");
				return res.status(404).json({ message: "User is terminated" });
			}

			// Генеруємо новий access token
			if (!JWT_KEY) {
				throw new Error("JWT_KEY is not defined");
			}

			const newAccessToken = jwt.sign(
				{ 
					id: user.id, 
					username: user.username, 
					email: user.email 
				}, 
				JWT_KEY, 
				{ expiresIn: "15m" }
			);

			res.cookie("access_token", newAccessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60 * 1000 // 15 хвилин
			});

			return res.status(200).json({ 
				message: "Access token refreshed successfully", 
				access_token: newAccessToken 
			});
		} catch (error) {
			console.error("refreshAccessToken error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	static async logout(req: Request, res: Response): Promise<any> {
		try {
			const refresh_token = req.cookies["refresh_token"];

			if (refresh_token) {
				// Очищаємо refresh token в базі даних
				try {
					const claims = verifyJwt(refresh_token) as JwtClaims;
					if (claims && claims.email) {
						const userResult = await UserService.findByEmailAndRefreshToken(claims.email, refresh_token);
						if (userResult.success && userResult.user) {
							await UserService.clearRefreshToken(userResult.user.id);
						}
					}
				} catch (error) {
					// Якщо токен недійсний, просто очищаємо cookies
					console.log("Invalid refresh token during logout");
				}
			}

			// Очищаємо cookies
			res.clearCookie("refresh_token");
			res.clearCookie("access_token");

			return res.status(200).json({ 
				message: "Logged out successfully", 
				success: true 
			});
		} catch (error) {
			console.error("Logout error:", error);
			// Очищаємо cookies навіть при помилці
			res.clearCookie("refresh_token");
			res.clearCookie("access_token");
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	static async checkRole(req: Request, res: Response): Promise<any> {
		try {
			const cookie = req.cookies["access_token"];

			if (!cookie) {
				return res.status(401).json({ message: "Not authenticated" });
			}

			if (!JWT_KEY) {
				return res.status(500).json({ message: "JWT_KEY is not configured" });
			}

			const claims = jwt.verify(cookie, JWT_KEY) as JwtClaims;

			if (!claims) {
				return res.status(401).json({ message: "Not authenticated" });
			}

			return res.status(200).json({ 
				message: "Success", 
				user: {
					id: claims.id,
					username: claims.username,
					email: claims.email
				}
			});
		} catch (err) {
			return res.status(401).json({ message: "Not authenticated" });
		}
	}
}
