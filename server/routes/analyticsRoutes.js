const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getFinancialSummary,
  getCategoryBreakdown,
} = require("../controllers/analyticsController");

router.get(
  "/summary",
  authMiddleware,
  getFinancialSummary
);

router.get(
  "/categories",
  authMiddleware,
  getCategoryBreakdown
);

module.exports = router;