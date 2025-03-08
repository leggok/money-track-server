import { UserType } from "./User";

export interface UserResponse {
	message?: string;
	success: boolean;
	user?: UserType;
	error?: unknown;
}
