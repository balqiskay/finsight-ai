const express = require("express");

const router = express.Router();

const {
  getAIInsights,
} = require(
  "../controllers/aiController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

router.get(
  "/insights",
  authMiddleware,
  getAIInsights
);

module.exports = router;