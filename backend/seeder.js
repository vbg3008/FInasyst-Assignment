import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Account from "./models/Account.js";
import Transaction from "./models/Transaction.js";
import connectDB from "./db.js";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the sample data file
const sampleData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./sampleData.json"), "utf-8")
);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Function to import sample data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Account.deleteMany();
    await Transaction.deleteMany();

    console.log("Data cleared from database");

    // Create users
    const createdUsers = await User.insertMany(sampleData.users);
    console.log(`${createdUsers.length} users created`);

    // Create accounts with user references
    const accountsWithUserIds = sampleData.accounts.map((account, index) => {
      return {
        ...account,
        user: createdUsers[index]._id,
        accountNumber: Math.floor(
          1000000000 + Math.random() * 9000000000
        ).toString(),
      };
    });

    const createdAccounts = await Account.insertMany(accountsWithUserIds);
    console.log(`${createdAccounts.length} accounts created`);

    // Create transactions with user references
    const transactionsWithUserIds = sampleData.transactions.map(
      (transaction, index) => {
        // Cycle through users if there are more transactions than users
        const userIndex = index % createdUsers.length;
        const timestamp = Date.now() + index; // Ensure unique timestamps
        const randomStr = Math.random().toString(36).substring(2, 10);

        return {
          ...transaction,
          user: createdUsers[userIndex]._id,
          reference:
            transaction.reference ||
            `${transaction.type.toUpperCase()}-${timestamp}`,
          transactionId: `TXN-${timestamp}-${randomStr}`,
        };
      }
    );

    const createdTransactions = await Transaction.insertMany(
      transactionsWithUserIds
    );
    console.log(`${createdTransactions.length} transactions created`);

    console.log("Sample data imported successfully");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy all data
const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Account.deleteMany();
    await Transaction.deleteMany();

    console.log("All data destroyed");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
