import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_KEY } from "../config";

export const signJwt = (userId: number, expiresIn: SignOptions["expiresIn"]) => {
	if (!JWT_KEY) {
		throw new Error("JWT_KEY is not defined");
	}

	const payload = { sub: userId };

	const token = jwt.sign(payload, JWT_KEY, { expiresIn });

	return token;
};

export const verifyJwt = (token: string) => {
	if (!JWT_KEY) {
		throw new Error("JWT_KEY is not defined");
	}

	return jwt.verify(token, JWT_KEY);
};
