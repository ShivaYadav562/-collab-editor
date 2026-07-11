const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // Required Fields
if (!username || !email || !password) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

// Email Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Please enter a valid email address",
  });
}

// Username Validation
if (username.trim().length < 3) {
  return res.status(400).json({
    message: "Username must be at least 3 characters.",
  });
}

// Password Validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
  });
}

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
      message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
  return res.status(400).json({
    message: "Email and Password are required",
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Please enter a valid email address",
  });
}

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please sign up first.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;