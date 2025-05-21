import User from "../models/User.js";
import Account from "../models/Account.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Generate a random account number
      const accountNumber = Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString();

      // Create an account for the user
      const account = await Account.create({
        user: user._id,
        balance: 0,
        accountType: "savings",
        accountNumber: accountNumber,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        account: {
          _id: account._id,
          accountNumber: account.accountNumber,
          balance: account.balance,
          accountType: account.accountType,
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Find user's account
      const account = await Account.findOne({ user: user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        account: account
          ? {
              _id: account._id,
              accountNumber: account.accountNumber,
              balance: account.balance,
              accountType: account.accountType,
            }
          : null,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      // Find user's account
      const account = await Account.findOne({ user: user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        account: account
          ? {
              _id: account._id,
              accountNumber: account.accountNumber,
              balance: account.balance,
              accountType: account.accountType,
            }
          : null,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
