// src/controllers/roomController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Create a new room (Admin Only)
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
      const { name, capacity, type } = req.body;

      if (!name || !capacity || !type) {
          res.status(400).json({ error: "All fields (name, capacity, type) are required" });
          return; // 🔹 Make sure to return `void`
      }

      const newRoom = await prisma.room.create({
          data: { name, capacity, type },
      });

      res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

// Placeholder functions
export const getRooms = (req: Request, res: Response) => {
  res.status(200).json({ message: "Rooms fetched (not implemented yet)" });
};

export const updateRoom = (req: Request, res: Response) => {
  res.status(200).json({ message: "Room updated (not implemented yet)" });
};

export const deleteRoom = (req: Request, res: Response) => {
  res.status(200).json({ message: "Room deleted (not implemented yet)" });
};