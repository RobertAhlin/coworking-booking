// src/routes/bookingRoutes.ts

import express from "express";
import { createBooking, getBookings } from "../controllers/bookingController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// 🔹 Create a new booking (Authenticated users only)
router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);

export default router;
