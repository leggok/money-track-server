import { Op, type Model } from "sequelize";
import { Debt as DebtType } from "../interfaces";
import Debt from "../models/Debt";
import Currency from "../models/Currency";
import User from "../models/User";
import checkExistingDataInDB from "../utils/checkExistingDataInDB";

type DebtInstance = Model & DebtType;
class DebtService {
    static async add({
        value,
        description,
        currency_id,
        lender_id,
        borrower_id,
        status,
        timestamp,
        due_at,
        paid_at
    }: DebtType) {
        try {
            await checkExistingDataInDB(Currency, currency_id, "Currency");
            await checkExistingDataInDB(User, lender_id, "Lender");
            await checkExistingDataInDB(User, borrower_id, "Borrower");

            const debt = await Debt.create({
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

            return {
                debt,
                success: true
            };
        } catch (error: any) {
            console.error("Error in add debt:", error);
            return {
                message: error.message || "Error in add debt",
                success: false
            };
        }
    }

    static async getAll(userId: number) {
        try {
            const debts = await Debt.findAll({
                where: {
                    [Op.or]: [{ lender_id: userId }, { borrower_id: userId }]
                }
            });

            return {
                debts,
                success: true
            };
        } catch (error: any) {
            console.error("Error in get all debts:", error);
            return {
                message: error.message || "Error in get all debts",
                success: false
            };
        }
    }
}

export default DebtService;
