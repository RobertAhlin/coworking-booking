import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { PrismaClient, Role } from "@prisma/client";

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

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Get bookings (User gets their own, Admin gets all)
export const getBookings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let bookings;

    if (user.role === "ADMIN") {
      bookings = await prisma.booking.findMany({
        include: { user: true, room: true },
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: { userId: user.userId },
        include: { room: true },
      });
    }

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
