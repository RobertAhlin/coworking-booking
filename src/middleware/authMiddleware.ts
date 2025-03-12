// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Extend Express Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization");

  if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
  }

  try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET) as { userId: string; role: string };
      (req as any).user = decoded; // Attach user info to request
      next();
  } catch (error) {
      res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!(req as any).user || (req as any).user.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Admin access required" });
      return;
  }
  next();
};

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  if (!(req as any).user) {
      res.status(401).json({ error: "Unauthorized: User must be logged in" });
      return;
  }
  next();
};