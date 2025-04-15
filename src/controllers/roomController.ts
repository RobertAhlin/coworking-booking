// src/controllers/roomController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import  redis from "../redis";
import { logger } from "../utils/logger";

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

    await redis.del("rooms"); // Remove cache so next getRooms fetches fresh data

    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    logger.error("Error creating room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Fetch all rooms from the cache or database
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const cached = await redis.get("rooms"); // Try to fetch from cache first
    if (cached) {
      console.log("Returning cached rooms");
      res.status(200).json({ message: "Rooms fetched from cache", rooms: JSON.parse(cached) });
      return;
    }

    const rooms = await prisma.room.findMany(); // If not in cache, fetch from DB
    await redis.set("rooms", JSON.stringify(rooms), "EX", 60); // Cach for 60 seconds

    res.status(200).json({ message: "Rooms fetched from DB", rooms });
    return;
  } catch (error) {
    logger.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// 🔹 Update a room (Admin Only)
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, capacity, type } = req.body;

    const existingRoom = await prisma.room.findUnique({ where: { id } });
    if (!existingRoom) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        name: name || existingRoom.name,
        capacity: capacity || existingRoom.capacity,
        type: type || existingRoom.type,
      },
    });
    console.log("[Redis] Current status:", redis.status);
    await redis.del("rooms"); // Remove cache so next getRooms fetches fresh data

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
    return;
  } catch (error) {
    logger.error("Error updating room:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

// 🔹 Delete a room (Admin Only)
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingRoom = await prisma.room.findUnique({ where: { id } });
    if (!existingRoom) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    await prisma.room.delete({ where: { id } });
    await redis.del("rooms"); // Remove cache so next getRooms fetches fresh data

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    logger.error("Error deleting room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};