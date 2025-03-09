import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres";
import Transaction from "./Transaction";

const Currency = sequelize.define(
	"Currency",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		symbol: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		exchange_rate: {
			type: DataTypes.DECIMAL(10, 4),
			allowNull: false,
		},
		is_main: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
	}
);

Currency.hasMany(Transaction, { foreignKey: "currency_id" });

export default Currency;
