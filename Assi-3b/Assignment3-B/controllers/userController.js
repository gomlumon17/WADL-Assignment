const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, role, github, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 2. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      role,
      github,
      password: hashedPassword
    });

    // 3. Return success without the password
    res.status(201).json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        github: user.github
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Fallback secret added just in case JWT_SECRET is missing from your .env
    const secret = process.env.JWT_SECRET || "default_development_secret";
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

    res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get Users
exports.getUsers = async (req, res) => {
  try {
    // .select("-password") ensures passwords are never sent to the frontend
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    // If they are updating their password, make sure to hash the new one
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error updating user" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user" });
  }
};