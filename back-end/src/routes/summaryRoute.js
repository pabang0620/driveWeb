const express = require("express");

const { getSummaryData } = require("../controllers/summaryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:startDate/:endDate", authMiddleware, getSummaryData);

module.exports = router;
