const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getPlans,
  getCurrentSubscription,
  upgradeSubscription,
  createCheckoutSession,
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

router.post(
  "/upgrade/:planId",
  authMiddleware,
  upgradeSubscription
);

router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession
);

module.exports = router;