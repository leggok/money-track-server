import { Request, Response } from "express";
import UsersService from "../services/UsersService";

export default class UsersController {
	static async getBalance(req: Request, res: Response): Promise<any> {
		try {
			const user_id = Number(req.params.user_id);
			const balance = await UsersService.getBalance(user_id);

			if (!balance.success) {
				return res.status(400).json({ message: balance.message, success: false });
			}

			return res.status(201).json({
				message: balance.message,
				success: true,
				balance: balance.balance,
			});
		} catch (error) {
			console.error("Get all balance error:", error);
			return res.status(500).json({ message: "Internal Server Error", success: false });
		}
	}
}
