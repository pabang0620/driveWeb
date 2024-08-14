const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getEstimatedIncomeTaxPage,
  updateUserIncome,
  getYearlyProfitLoss,
  getMonthlyProfitLoss,
  getQuarterlyProfitLoss,
} = require("../controllers/taxController");

const router = express.Router();

// 예상 종합 소득세
router.get(
  "/estimatedIncomeTaxPage/:year",
  authMiddleware,
  getEstimatedIncomeTaxPage
);

router.put("/income", authMiddleware, updateUserIncome);

// 손익 계산서
router.get(
  "/profitLossStatement/yearly/:year",
  authMiddleware,
  getYearlyProfitLoss
);

// 월별 손익계산서 조회
router.get(
  "/profitLossStatement/monthly",
  authMiddleware,
  getMonthlyProfitLoss
);

// 분기별 손익계산서 조회
router.get(
  "/profitLossStatement/quarterly/:year/:quarter",
  authMiddleware,
  getQuarterlyProfitLoss
);

module.exports = router;
