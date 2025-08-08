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
				console.log(`   📭 Table "${tableName}" exists but is empty`);
				return false;
			}
			console.log(`   ✅ Table "${tableName}" exists and has data`);
			return true;
		} else {
			console.log(`   ❌ Table "${tableName}" does not exist`);
			return false;
		}
	} catch (error) {
		console.error(`   ⚠️ Error while checking table "${tableName}":`, error);
		return false; // return false to allow creation of default data
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
