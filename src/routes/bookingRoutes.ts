// src/routes/bookingRoutes.ts

import express from "express";
import { createBooking } from "../controllers/bookingController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// 🔹 Create a new booking (Authenticated users only)
router.post("/", verifyToken, createBooking);

export default router;
