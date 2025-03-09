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
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		category_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "Category",
				key: "id",
			},
		},
		currency_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "Currencies", // Назва таблиці currency
				key: "id", // Поле, на яке посилається зовнішній ключ
			},
		},
	},
	{
		timestamps: true,
	}
);

Transaction.belongsTo(Currency, { foreignKey: "currency_id" });
Currency.hasMany(Transaction, { foreignKey: "currency_id" });

Transaction.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Transaction, { foreignKey: "category_id" });

export default Transaction;
