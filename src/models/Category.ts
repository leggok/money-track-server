import { DataTypes } from "sequelize";
import { sequelize } from "../db/postgres";
import Transaction from "./Transaction";

const Category = sequelize.define(
	"Category",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

export default Category;
