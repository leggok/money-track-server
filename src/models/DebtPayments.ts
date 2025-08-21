import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres";
import Debt from "./Debt";

const DebtPayments = sequelize.define(
	"debt_payments ",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		debt_id : {
			type: DataTypes.INTEGER,
			references: {
				model: Debt, // Назва таблиці currency
				key: "id", // Поле, на яке посилається зовнішній ключ
			},
		},
		paid_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		timestamps: true,
	}
);

export default DebtPayments;
