import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Test GET route
router.get("/test", (req, res) => {
  res.json({ message: "Auth GET routes are working" });
});

// Test POST route
router.post("/test", (req, res) => {
  res.json({
    message: "Auth POST routes are working",
    receivedData: req.body,
  });
});

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user profile (protected route)
router.get("/profile", protect, getUserProfile);

export default router;
