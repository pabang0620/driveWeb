const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// 결제 확인 라우트
router.post("/confirm", paymentController.confirmPayment);

module.exports = router;
