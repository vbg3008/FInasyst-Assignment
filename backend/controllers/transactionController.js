import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import mongoose from "mongoose";

// @desc    Initiate a new transaction
// @route   POST /api/transactions/initiate
// @access  Private
export const initiateTransaction = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();

  try {
    // Start transaction - Atomicity & Isolation
    session.startTransaction();

    const { type, amount, description } = req.body;

    // Validate transaction type
    if (!["deposit", "withdrawal", "transfer"].includes(type)) {
      res.status(400);
      throw new Error("Invalid transaction type");
    }

    // Validate amount
    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error("Please enter a valid amount greater than 0");
    }

    // Find user's account with session - Isolation
    const account = await Account.findOne({ user: req.user._id }, null, {
      session,
    });

    if (!account) {
      res.status(404);
      throw new Error("Account not found");
    }

    // Check if sufficient balance for withdrawal or transfer - Consistency
    if (
      (type === "withdrawal" || type === "transfer") &&
      account.balance < amount
    ) {
      res.status(400);
      throw new Error("Insufficient funds");
    }

    // Update account balance based on transaction type
    const originalBalance = account.balance;
    if (type === "deposit") {
      account.balance += Number(amount);
    } else if (type === "withdrawal" || type === "transfer") {
      account.balance -= Number(amount);
    }

    // Ensure balance doesn't go negative - Consistency
    if (account.balance < 0) {
      await session.abortTransaction();
      session.endSession();
      res.status(400);
      throw new Error("Transaction would result in negative balance");
    }

    // Save account changes within the transaction - Atomicity
    await account.save({ session });

    // Generate unique transaction ID and reference
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const transactionId = `TXN-${timestamp}-${randomStr}`;
    const reference = `${type.toUpperCase()}-${timestamp}`;

    // Check if a transaction with this ID already exists
    const existingTransaction = await Transaction.findOne({
      $or: [{ transactionId }, { reference }],
    });

    if (existingTransaction) {
      await session.abortTransaction();
      session.endSession();
      res.status(400);
      throw new Error("Duplicate transaction detected. Please try again.");
    }

    // Create transaction record within the same session - Atomicity
    const transaction = await Transaction.create(
      [
        {
          user: req.user._id,
          type,
          amount,
          description: description || `${type} transaction`,
          status: "completed",
          reference,
          transactionId,
        },
      ],
      { session }
    );

    // Commit the transaction - Durability
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Transaction successful",
      transaction: {
        _id: transaction[0]._id,
        type: transaction[0].type,
        amount: transaction[0].amount,
        description: transaction[0].description,
        status: transaction[0].status,
        reference: transaction[0].reference,
        createdAt: transaction[0].createdAt,
      },
      accountBalance: account.balance,
      previousBalance: originalBalance,
    });
  } catch (error) {
    // Abort transaction on error - Atomicity
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction error:", error);
    res.status(400).json({
      message: error.message,
      error: "Transaction failed and was rolled back",
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/transactions/history
// @access  Private
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this transaction");
    }

    res.json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
