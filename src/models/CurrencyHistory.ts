import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres";
import Transaction from "./Transaction";
import Currency from "./Currency";

const CurrencyHistory = sequelize.define(
	"currency_history",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		currency_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Currency,
				key: "id",
			},
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		exchange_rate: {
			type: DataTypes.DECIMAL(10, 4),
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

export default CurrencyHistory;
