// src/routes/roomRoutes.ts

import express from "express";
import { createRoom, getRooms, updateRoom, deleteRoom } from "../controllers/roomController";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// 🔹 Create a new room (Admin only)
router.post("/", verifyToken, isAdmin, createRoom);

// 🔹 Get all rooms (Anyone can access)
router.get("/", getRooms);

// 🔹 Update a room (Admin only)
router.put("/:id", verifyToken, isAdmin, updateRoom);

// 🔹 Delete a room (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteRoom);

export default router;
