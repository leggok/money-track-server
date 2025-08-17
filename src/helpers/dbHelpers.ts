import { sequelize } from "../db/postgres";
import { QueryTypes } from "sequelize";
import { User } from "../models";
import { generateDefaultUserData } from "../db/defaultData";

export async function tableExist(tableName: string): Promise<boolean> {
	try {
		const result = await sequelize.getQueryInterface().showAllTables();
		console.log(`   🔍 Available tables:`, result);
		console.log(`   🔍 Looking for table: "${tableName}"`);
		
		// Перевіряємо різні варіанти регістру назви таблиці
		const tableExists = result.some(table => 
			table.toLowerCase() === tableName.toLowerCase() ||
			table === tableName
		);
		
		console.log(`   🔍 Table "${tableName}" exists: ${tableExists}`);
		return tableExists;
	} catch (error) {
		console.error(`Error checking if table "${tableName}" exists:`, error);
		return false;
	}
}

export async function isTableEmpty(tableName: string): Promise<boolean> {
	try {
		// Спочатку знайдемо правильну назву таблиці
		const allTables = await sequelize.getQueryInterface().showAllTables();
		const actualTableName = allTables.find(table => 
			table.toLowerCase() === tableName.toLowerCase()
		);
		
		if (!actualTableName) {
			console.log(`   ❌ Table "${tableName}" not found in database`);
			return true; // вважаємо таблицю порожньою, якщо її немає
		}
		
		console.log(`   🔍 Using actual table name: "${actualTableName}"`);
		const result = await sequelize.query(`SELECT COUNT(*) FROM "${actualTableName}"`, { type: QueryTypes.SELECT });
		const count = parseInt((result as any)[0].count, 10);
		
		console.log(`   📊 Table "${actualTableName}" has ${count} records`);
		return count === 0;
	} catch (error) {
		console.error(`Error checking if table "${tableName}" is empty:`, error);
		return true; // вважаємо таблицю порожньою при помилці
	}
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
