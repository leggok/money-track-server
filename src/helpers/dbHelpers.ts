import { sequelize } from "../db/postgres";
import { QueryTypes } from "sequelize";
import { User } from "../models";
import { generateDefaultUserData } from "../db/defaultData";

export async function tableExist(tableName: string): Promise<boolean> {
	const result = await sequelize.getQueryInterface().showAllTables();
	return result.includes(tableName);
}

export async function isTableEmpty(tableName: string): Promise<boolean> {
	const result = await sequelize.query(`SELECT COUNT(*) FROM "${tableName}"`, { type: QueryTypes.SELECT });

	return parseInt((result as any)[0].count, 10) === 0;
}

export async function isTableExistAndNotEmpty(tableName: string) {
	try {
		if (await tableExist(tableName)) {
			const empty = await isTableEmpty(tableName);
			if (empty) {
				console.log(`Table "${tableName}" is empty`);
				return false;
			}
			console.log(`Table "${tableName}" is not empty`);
			return true;
		} else {
			console.log(`Table "${tableName}" is not exist`);
			return false;
		}
	} catch (error) {
		console.error("Error while checking if table exist and not empty:", error);
		return true; // return true to avoid duplicate default user
	}
}

export async function createDefaultData() {
	try {
		const userData = await generateDefaultUserData();
		const user = {
			...userData,
		};

		await User.create(user);
	} catch (error) {
		console.error("Error while creating default user data: ", error);
	}
}
