const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  addGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/savingsController");

router.post(
  "/",
  authMiddleware,
  addGoal
);

router.get(
  "/",
  authMiddleware,
  getGoals
);

router.put(
  "/:id",
  authMiddleware,
  updateGoal
);

router.delete(
  "/:id",
  authMiddleware,
  deleteGoal
);

module.exports = router;