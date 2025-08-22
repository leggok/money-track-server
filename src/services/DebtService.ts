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
        lender_name,
        borrower_id,
        status,
        timestamp,
        due_at,
        paid_at
    }: DebtType) {
        try {
            // at least one of lender_id or borrower_id must be provided
            if (!lender_id && !borrower_id) {
                throw new Error("Either lender_id or borrower_id must be provided");
            }
            await checkExistingDataInDB(Currency, currency_id, "Currency");
            if (lender_id) {
                await checkExistingDataInDB(User, lender_id, "Lender");
            }
            if (borrower_id) {
                await checkExistingDataInDB(User, borrower_id, "Borrower");
            }

            const debtData: any = {
                value,
                description,
                currency_id,
                lender_name: lender_name || "",
                borrower_id,
                status,
                timestamp,
                due_at,
                paid_at
            };

            if (lender_id) {
                debtData.lender_id = lender_id;
            }

            const debt = await Debt.create(debtData);

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
