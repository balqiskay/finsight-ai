const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getFinancialSummary,
  getCategoryBreakdown,
  getMonthlyAnalytics,
  getAdvancedAnalytics,
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

router.get(
  "/monthly",
  authMiddleware,
  getMonthlyAnalytics
);

router.get(
  "/advanced",
  authMiddleware,
  getAdvancedAnalytics
);

module.exports = router;