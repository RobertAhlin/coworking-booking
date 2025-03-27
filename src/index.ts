// src/index.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import userRoutes from "./routes/userRoutes";
import path from "path";


dotenv.config();

const app: Express = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*" // Tillåt alla för enkel testning, anpassa för produktion
  }
});

// 🔌 Socket.IO-anslutning
io.on("connection", (socket) => {
  console.log("📡 A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ A client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use(express.static(path.join(__dirname, "..", "public")));

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    console.log("REDISCLOUD_URL:", process.env.REDISCLOUD_URL);
});