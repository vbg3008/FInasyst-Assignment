import express from "express";
import {
  initiateTransaction,
  getTransactionHistory,
  getTransactionById,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Initiate a new transaction
router.post("/initiate", initiateTransaction);

// Get transaction history
router.get("/history", getTransactionHistory);

// Get transaction by ID
router.get("/:id", getTransactionById);

export default router;
