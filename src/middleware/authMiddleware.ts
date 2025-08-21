import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwtUtils";
import User from "../models/User";

// Augment Express Request type to include user info
declare module "express-serve-static-core" {
    interface Request {
        user?: { id: number; role?: string };
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Token can come from Authorization header as Bearer token or from cookie
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : req.cookies?.["access_token"];

        if (!token) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        const decoded = verifyJwt(token) as { sub?: number; id?: number; role?: string };
        const userId = decoded.sub ?? decoded.id;

        if (!userId) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        const user = await User.findByPk(userId);

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        req.user = { id: userId, role: (user as any).role };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};

export default authMiddleware;
