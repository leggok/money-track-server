import { Request, Response, NextFunction } from "express";
import { body as check, validationResult } from "express-validator";

export const registrationValidation = () => [
	check("email").isEmail().withMessage("Invalid email"),
	check("first_name").isString().withMessage("first_name must be a string"),
	check("last_name").optional().isString().withMessage("last_name must be a string"),
	check("username").isString().withMessage("Username must be a string"),
	check("password").isString().withMessage("Password must be a string"),
	// Handle validation result
	(req: Request, res: Response, next: NextFunction): void => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		next();
	},
];
export const loginValidation = () => [
	check("email").isEmail().withMessage("Invalid email"),
	check("password").isString().withMessage("Password must be a string"),
	// Handle validation result
	(req: Request, res: Response, next: NextFunction): void => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		next();
	},
];
