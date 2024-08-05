const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getEstimatedIncomeTaxPage,
  updateUserIncome,
  getProfitLossStatementPage,
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
  "/profitLossStatementPage/:year",
  authMiddleware,
  getProfitLossStatementPage
);

module.exports = router;
