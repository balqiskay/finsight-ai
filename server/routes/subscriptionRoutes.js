const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getPlans,
  getCurrentSubscription,
} = require("../controllers/subscriptionController");

router.get(
  "/plans",
  getPlans
);

router.get(
  "/current",
  authMiddleware,
  getCurrentSubscription
);

module.exports = router;