import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres";
import Currency from "./Currency";
import Category from "./Category";

const Transaction = sequelize.define(
	"Transaction",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		value: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		category_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Category,
				key: "id",
			},
		},
		currency_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Currency, // Назва таблиці currency
				key: "id", // Поле, на яке посилається зовнішній ключ
			},
		},
		type: {
			type: DataTypes.ENUM("expense", "income"),
			allowNull: false,
			defaultValue: "expense",
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		timestamps: true,
	}
);

export default Transaction;
