const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const email = req.body.email?.toLowerCase().trim();

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return res.status(400).json({
        message:
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );

    const newUser = await pool.query(
      `INSERT INTO users 
      (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      {
        userId: newUser.rows[0].id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.rows[0].id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
      },
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};