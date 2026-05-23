const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  addRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} = require("../controllers/recurringController");

router.post(
  "/",
  authMiddleware,
  addRecurringTransaction
);

router.get(
  "/",
  authMiddleware,
  getRecurringTransactions
);

router.put(
  "/:id",
  authMiddleware,
  updateRecurringTransaction
);

router.delete(
  "/:id",
  authMiddleware,
  deleteRecurringTransaction
);

module.exports = router;