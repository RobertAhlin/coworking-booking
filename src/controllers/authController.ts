// src/controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword, generateToken } from "../services/authService";

const prisma = new PrismaClient();

// 🔹 Register a new user
export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, role } = req.body;
  
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return; // Exit function after sending response
      }
  
      // Hash password before saving
      const hashedPassword = await hashPassword(password);
  
      // Create user in database
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: role || "USER", // Default role is USER
        },
      });
  
      res.status(201).json({ message: "User registered successfully", userId: newUser.id });
      return; // Exit function after sending response
    } catch (error) {
      next(error); // Pass error to Express error handler
    }
  }
  
  

// 🔹 Login user and return JWT token
export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(400).json({ error: "Invalid email or password" });
        return; // Exit function after sending response
      }
  
      // Compare password with stored hash
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ error: "Invalid email or password" });
        return; // ✅ Exit function after sending response
      }
  
      // Generate JWT token
      const token = generateToken(user.id, user.role);
  
      res.json({ message: "Login successful", token });
      return; // ✅ Exit function after sending response
    } catch (error) {
      next(error); // Pass error to Express error handler
    }
  }
  
