import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres";
import Currency from "./Currency";
import User from "./User";

const Debt = sequelize.define(
	"debt",
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
		currency_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Currency,
				key: "id",
			},
		},
		lender_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		borrower_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		status: {
			type: DataTypes.ENUM('active','paid','overdue','cancelled'),
			allowNull: false,
			defaultValue: "active",
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		due_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
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

export default Debt;
