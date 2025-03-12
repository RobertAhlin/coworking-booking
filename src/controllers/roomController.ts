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
          return;
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

// Fetch all rooms from the database
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await prisma.room.findMany();

    res.status(200).json({ message: "Rooms fetched successfully", rooms });
    return;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get room ID from request parameters
    const { name, capacity, type } = req.body; // Get updated values from request body

    // Check if the room exists
    const existingRoom = await prisma.room.findUnique({ where: { id } });

    if (!existingRoom) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    // Update room in the database
    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        name: name || existingRoom.name, // Keep existing value if no new value provided
        capacity: capacity || existingRoom.capacity,
        type: type || existingRoom.type,
      },
    });

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
    return;
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// 🔹 Delete a room (Admin Only)
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the room ID from the request

    // Check if the room exists
    const existingRoom = await prisma.room.findUnique({ where: { id } });
    if (!existingRoom) {
      res.status(404).json({ error: "Room not found" });
      return
    }

    // Delete the room
    await prisma.room.delete({ where: { id } });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};