// src/routes/bookingRoutes.ts

import express from "express";
import { createBooking, getBookings, updateBooking, deleteBooking } from "../controllers/bookingController";
import { verifyToken, authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// 🔹 Create a new booking (Authenticated users only)
router.post("/", verifyToken, authenticateUser, createBooking);
router.get("/", verifyToken, authenticateUser, getBookings);
router.put("/:id", verifyToken, authenticateUser, updateBooking);
router.delete("/:id", verifyToken, authenticateUser, deleteBooking);

export default router;
