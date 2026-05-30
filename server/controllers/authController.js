const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const {
  sendVerificationEmail,
   sendPasswordResetEmail,
} = require("../services/emailService");

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

    const verificationToken =
     crypto.randomBytes(32)
     .toString("hex");

    const newUser = await pool.query(
      `INSERT INTO users 
      (username, email, password, verification_token)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email`,
      [
        username,
        email,
        hashedPassword,
        verificationToken,
      ]
    );

    await sendVerificationEmail(
      email,
      verificationToken
    );

    res.status(201).json({
      message:
      "Registration successful. Please check your email to verify your account.",
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

    if (!user.rows[0].is_verified) {
      return res.status(403).json({
        message:
        "Please verify your email before logging in",
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

exports.verifyEmail =
async (req, res) => {

  try {

    const { token } = req.params;

    const user =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE verification_token = $1
        `,
        [token]
      );

    if (
      user.rows.length === 0
    ) {
      return res.status(400).json({
        message:
          "Invalid verification token",
      });
    }

    await pool.query(
      `
      UPDATE users
      SET
        is_verified = TRUE,
        verification_token = NULL
      WHERE id = $1
      `,
      [user.rows[0].id]
    );

    res.status(200).json({
      message:
        "Email verified successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }

};

exports.forgotPassword =
async (req, res) => {

  try {

    const { email } = req.body;

    const user =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email.toLowerCase().trim()]
      );

    if (
      user.rows.length === 0
    ) {
      return res.status(200).json({
        message:
          "If an account exists, a reset link has been sent.",
      });
    }

    const resetToken =
      crypto.randomBytes(32)
        .toString("hex");

    const expires =
      new Date(
        Date.now() +
        60 * 60 * 1000
      );

    await pool.query(
      `
      UPDATE users
      SET
        reset_password_token = $1,
        reset_password_expires = $2
      WHERE id = $3
      `,
      [
        resetToken,
        expires,
        user.rows[0].id,
      ]
    );

    await sendPasswordResetEmail(
      user.rows[0].email,
      resetToken
    );

    res.status(200).json({
      message:
        "If an account exists, a reset link has been sent.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server error",
    });

  }

};

exports.resetPassword =
async (req, res) => {

  try {

    const { token } = req.params;

    const { password } = req.body;

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

    const user =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE reset_password_token = $1
        `,
        [token]
      );

    if (
      user.rows.length === 0
    ) {
      return res.status(400).json({
        message:
          "Invalid reset token",
      });
    }

    if (
      new Date(
        user.rows[0].reset_password_expires
      ) < new Date()
    ) {
      return res.status(400).json({
        message:
          "Reset token has expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        reset_password_token = NULL,
        reset_password_expires = NULL
      WHERE id = $2
      `,
      [
        hashedPassword,
        user.rows[0].id,
      ]
    );

    res.status(200).json({
      message:
        "Password reset successful",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server error",
    });

  }

};