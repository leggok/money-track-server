export interface Currency {
	id?: number;
	name: string;
	code: string;
	symbol: string;
	country: string;
	exchange_rate: number;
	is_main: boolean;
}
