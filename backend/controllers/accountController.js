import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// @desc    Get user account balance
// @route   GET /api/account/balance
// @access  Private
export const getAccountBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user._id });

    if (!account) {
      res.status(404);
      throw new Error("Account not found");
    }

    res.json({
      _id: account._id,
      accountNumber: account.accountNumber,
      balance: account.balance,
      accountType: account.accountType,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Deposit funds to account (for testing purposes)
// @route   POST /api/account/deposit
// @access  Private
export const depositFunds = async (req, res) => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();

  try {
    // Start transaction - Atomicity & Isolation
    session.startTransaction();

    const { amount } = req.body;

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

    // Store original balance for reference
    const originalBalance = account.balance;

    // Update account balance
    account.balance += Number(amount);

    // Save account changes within the transaction - Atomicity
    await account.save({ session });

    // Generate unique transaction ID and reference
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const transactionId = `TXN-${timestamp}-${randomStr}`;
    const reference = `DEP-${timestamp}`;

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
          type: "deposit",
          amount,
          description: "Deposit to account",
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

    res.status(200).json({
      message: "Deposit successful",
      account: {
        _id: account._id,
        accountNumber: account.accountNumber,
        balance: account.balance,
        accountType: account.accountType,
      },
      transaction: {
        _id: transaction[0]._id,
        type: transaction[0].type,
        amount: transaction[0].amount,
        status: transaction[0].status,
        createdAt: transaction[0].createdAt,
      },
      previousBalance: originalBalance,
    });
  } catch (error) {
    // Abort transaction on error - Atomicity
    await session.abortTransaction();
    session.endSession();

    console.error("Deposit error:", error);
    res.status(400).json({
      message: error.message,
      error: "Deposit failed and was rolled back",
    });
  }
};
