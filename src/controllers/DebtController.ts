import { Request, Response } from "express";
import DebtService from "../services/DebtService";

export class DebtController {
    static async add(req: Request, res: Response): Promise<any> {
        try {
            const { id: userId } = req.user as { id: number };
            const {
                value,
                description,
                currency_id,
                lender_id,
                borrower_id,
                status,
                timestamp,
                due_at,
                paid_at
            } = req.body;

            if (userId !== lender_id && userId !== borrower_id) {
                return res
                    .status(403)
                    .json({ message: "You are not allowed to add debt for this user" });
            }

            const debt = await DebtService.add({
                value,
                description,
                currency_id,
                lender_id,
                borrower_id,
                status,
                timestamp,
                due_at,
                paid_at
            });

            if (!debt.success) {
                return res.status(400).json({ message: debt.message });
            }

            return res.status(201).json(debt.debt);
        } catch (error) {}
    }
}
