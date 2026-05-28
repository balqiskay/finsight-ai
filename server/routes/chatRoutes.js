const express = require("express");

const router = express.Router();

const {
  askFinancialAssistant,
  getChatHistory,
} = require("../controllers/chatController");

const authMiddleware =
  require("../middleware/authMiddleware");

router.get(
  "/history",
  authMiddleware,
  getChatHistory
);

router.post(
  "/ask",
  authMiddleware,
  askFinancialAssistant
);

module.exports = router;