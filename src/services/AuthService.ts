import { SignOptions } from "jsonwebtoken";
import { signJwt } from "../utils/jwtUtils";
import { TokensResponse } from "../interfaces/Responses";
import { ACCESS_TTL, REFRESH_TTL } from "../config";

class AuthService {
	static generateTokens(userId: number): TokensResponse {
		try {
			const accessToken = signJwt(userId, ACCESS_TTL as SignOptions["expiresIn"]);
			const refresh_token = signJwt(userId, REFRESH_TTL as SignOptions["expiresIn"]);

			return {
				message: "Tokens generated successfully",
				success: true,
				data: { accessToken, refresh_token },
			};
		} catch (error) {
			console.error("Error in generateTokens", error);
			return {
				message: "Error in generateTokens",
				error,
				success: false,
				data: null,
			};
		}
	}
}

export default AuthService;
