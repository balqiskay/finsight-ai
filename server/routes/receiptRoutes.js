const express = require("express");

const multer = require("multer");

const router = express.Router();

const {
  scanReceipt,
} = require("../controllers/receiptController");

const authMiddleware =
  require("../middleware/authMiddleware");

const storage =
  multer.memoryStorage();

const upload =
  multer({ storage });

router.post(
  "/scan",
  authMiddleware,
  upload.single("receipt"),
  scanReceipt
);

module.exports = router;