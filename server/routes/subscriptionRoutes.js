const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getPlans,
  getCurrentSubscription,
  upgradeSubscription,
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

module.exports = router;