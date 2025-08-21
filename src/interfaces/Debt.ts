export interface Debt {
	id?: number;
	value: number;
	description: string;
	currency_id: number;
	lender_id: number;
	borrower_id: number;
	status: string;
	timestamp: Date;
	due_at: Date;
	paid_at: Date;
}
