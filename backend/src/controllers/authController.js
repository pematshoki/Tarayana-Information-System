const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.register = async (req, res) => {
  try {
    let { email, roleName } = req.body;

    // Normalize email to avoid case-sensitive duplicates
    email = email.toLowerCase();

    // Find role
    const role = await Role.findOne({ roleName });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate random password
    const randomPassword = crypto.randomBytes(4).toString("hex");

    // Hash password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create user
    let user;
    try {
      user = await User.create({
        email,
        roleId: role._id,
        password: hashedPassword
      });
    } catch (err) {
      // Handle duplicate key error (race condition)
      if (err.code === 11000) {
        return res.status(400).json({ message: "User already exists" });
      }
      throw err; // other errors
    }

    // Send password via email
    await sendEmail(email, roleName, randomPassword);

    // Success response
    res.json({ message: "User registered successfully. Password sent to email." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Fetch role name from Role collection
    const role = await Role.findById(user.roleId);
    const roleName = role ? role.roleName : "Unknown";

    // Send response
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: roleName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};