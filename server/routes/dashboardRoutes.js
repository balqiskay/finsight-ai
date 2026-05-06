const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    res.json({
      message: "Welcome to FinSight AI Dashboard",
      user: req.user,
    });

  }
);

module.exports = router;