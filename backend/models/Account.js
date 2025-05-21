import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["savings", "checking", "investment"],
      default: "savings",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a random account number before saving if not provided
accountSchema.pre("save", async function (next) {
  // If accountNumber is not set or is being modified and is empty
  if (!this.accountNumber) {
    // Generate a random 10-digit account number
    this.accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
  }
  next();
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
