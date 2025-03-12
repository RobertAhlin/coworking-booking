// src/index.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";

dotenv.config();

const app: Express = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});