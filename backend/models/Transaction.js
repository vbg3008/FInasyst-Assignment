import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["deposit", "withdrawal", "transfer"],
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be at least 0.01"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    reference: {
      type: String,
      required: true,
      unique: true, // Ensure unique transaction references
      index: true, // Index for faster lookups
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensure unique transaction IDs
      index: true, // Index for faster lookups
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
