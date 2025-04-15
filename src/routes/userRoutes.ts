// src/routes/userRoutes.ts

import express from "express";
import { getAllUsers, deleteUser } from "../controllers/userController";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// 🔹 Get all users (Admin only)
router.get("/", verifyToken, isAdmin, getAllUsers);

// 🔹 Delete user by ID (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;