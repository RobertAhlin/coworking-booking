// src/routes/userRoutes.ts

import express from "express";
import { deleteUser } from "../controllers/userController";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// 🔹 Delete user (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;