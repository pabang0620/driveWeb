const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// 결제 확인 라우트
router.post("/confirm", paymentController.confirmPayment);
router.post("/success", paymentController.handlePaymentSuccess);
router.get("/", authMiddleware, paymentController.getExpirationDate);

module.exports = router;
