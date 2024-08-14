const express = require("express");
const {
  getMyPageData,
  getExpenseSummary,
  getIncomeSummary,
  getSummaryData,
  getDrivingSummary,
} = require("../controllers/mypageController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:startDate/:endDate", authMiddleware, getMyPageData);

// 지출 요약 데이터 조회

router.get(
  "/expense-summary/:startDate/:endDate",
  authMiddleware,
  getExpenseSummary
);
// 수입 요약 데이터 조회

router.get(
  "/income-summary/:startDate/:endDate",
  authMiddleware,
  getIncomeSummary
);

router.get("/mixChart/:startDate/:endDate", authMiddleware, getDrivingSummary);

module.exports = router;
