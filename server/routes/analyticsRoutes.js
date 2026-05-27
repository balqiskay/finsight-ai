const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getFinancialSummary,
  getCategoryBreakdown,
  getMonthlyAnalytics,
  getAdvancedAnalytics,
  getSpendingAlerts,
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

router.get(
  "/alerts",
  authMiddleware,
  getSpendingAlerts
);

module.exports = router;