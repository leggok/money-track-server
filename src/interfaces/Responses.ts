import { UserType } from "./User";

type BaseResponse<T> = {
	message: string;
	success: boolean;
	error?: any;
} & (T extends undefined ? {} : { [K in keyof T]: T[K] });

export type CreateUserResponse = BaseResponse<{ user: UserType | null }>;
export type TokensResponse = BaseResponse<{ data: { accessToken: string; refresh_token: string } | null }>;
