export interface Transaction {
	id?: number;
	value: number;
	description?: string;
	category_id: number;
	currency_id: number;
	type: "expense" | "income";
	timestamp?: string;
}
