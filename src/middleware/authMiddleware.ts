// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Role } from "@prisma/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Extend Express Request type to include `user`
export interface AuthRequest extends Request {
  user?: { userId: string; role: Role };
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: Role };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as AuthRequest).user;

  if (!user || user.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Admin access required" });
      return;
  }
  next();
};

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as AuthRequest).user;

  if (!user) {
      res.status(401).json({ error: "Unauthorized: User must be logged in" });
      return;
  }
  next();
};