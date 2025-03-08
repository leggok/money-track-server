import { Request, Response } from "express";
import UserService from "../services/UserService";

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

			const result = await UserService.create(firstName, lastName, username, email, password);

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
}
