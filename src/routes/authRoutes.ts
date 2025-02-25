// src/routes/authRoutes.ts

import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

// ✅ Import the custom AuthRequest type
import { Request, Response } from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Fix the protected route by using `Request & { user: any }`
router.get("/profile", authenticateUser, (req: Request & { user?: any }, res: Response) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

export default router;