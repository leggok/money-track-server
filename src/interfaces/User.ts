export interface UserType {
	first_name: string;
	last_name?: string;
	username: string;
	refresh_token?: string;
	avatar?: string;
	email: string;
	password?: string;
	id: number;
	updatedAt?: Date;
	createdAt?: Date;
	total_budget: number;
	main_currency_id: number;
}
