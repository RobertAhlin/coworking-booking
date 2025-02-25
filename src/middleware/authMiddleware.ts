// Users must send a valid JWT token to access protected routes.
// Admins have special privileges.
// Middleware verifies the token and attaches user info to req.user

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Extend Express Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

// 🔹 Middleware to verify JWT token
export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded; // ✅ Now TypeScript recognizes `user`
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden: Invalid token" });
    return;
  }
}
