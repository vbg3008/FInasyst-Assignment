import express from "express";
import {
  getAccountBalance,
  depositFunds,
} from "../controllers/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get account balance
router.get("/balance", getAccountBalance);

// Deposit funds (for testing)
router.post("/deposit", depositFunds);

export default router;
