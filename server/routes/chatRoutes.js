const express = require("express");

const router = express.Router();

const {
  askFinancialAssistant,
} = require("../controllers/chatController");

const authMiddleware =
  require("../middleware/authMiddleware");

router.post(
  "/ask",
  authMiddleware,
  askFinancialAssistant
);

module.exports = router;