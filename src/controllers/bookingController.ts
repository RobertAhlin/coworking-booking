// src/controllers/bookingController.ts

import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { PrismaClient, Role } from "@prisma/client";
import { io } from "../index";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

// 🔹 Create a new booking
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: Missing user ID" });
      return;
    }

    if (!roomId || !startTime || !endTime) {
      res.status(400).json({ error: "roomId, startTime, and endTime are required" });
      return;
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        roomId,
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime: { gt: new Date(startTime) } },
        ],
      },
    });

    if (overlapping) {
      res.status(400).json({ error: "Room is already booked for that time" });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    io.emit("bookingCreated", booking);
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    logger.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Get bookings (User gets their own, Admin gets all)
export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.userId },
      include: {
        room: true,
        user: user.role === "ADMIN"
      },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    logger.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Update booking
export const updateBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingBooking = await prisma.booking.findUnique({ where: { id } });

    if (!existingBooking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (user.role !== "ADMIN" && existingBooking.userId !== user.userId) {
      res.status(403).json({ error: "Forbidden: Not allowed to update this booking" });
      return;
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        roomId: existingBooking.roomId,
        id: { not: id },
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime: { gt: new Date(startTime) } },
        ],
      },
    });

    if (overlapping) {
      res.status(400).json({ error: "Room is already booked for that time" });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    io.emit("bookingUpdated", updated);
    res.status(200).json({ message: "Booking updated", booking: updated });
  } catch (error) {
    logger.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Delete booking
export const deleteBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (user.role !== "ADMIN" && booking.userId !== user.userId) {
      res.status(403).json({ error: "Forbidden: Not allowed to delete this booking" });
      return;
    }

    await prisma.booking.delete({ where: { id } });
    io.emit("bookingDeleted", { id });

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    logger.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};