const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
  kakaoLogin,
  naverLogin,
  addFranchiseFee,
  removeFranchiseFee,
  fetchUserProfile,
  fetchUserVehiclesWithFees,
  fetchUserIncomeRecords,
  updateUserProfile,
  updateUserIncome,
  updateUserVehicleHandler,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const handleFileUpload = require("../middleware/handleFileUpload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/google-login", googleLogin);
router.post("/kakao-login", kakaoLogin);
router.post("/naver-login", naverLogin);

router.get("/profile", authMiddleware, fetchUserProfile);

router.put("/profile", authMiddleware, handleFileUpload, updateUserProfile);

router.get("/vehicles", authMiddleware, fetchUserVehiclesWithFees);

router.put("/vehicles", authMiddleware, updateUserVehicleHandler);

router.get("/income", authMiddleware, fetchUserIncomeRecords);

router.put("/income", authMiddleware, updateUserIncome);

router.post("/franchise-fee", authMiddleware, addFranchiseFee);

router.delete("/franchise-fee/:id", authMiddleware, removeFranchiseFee);

module.exports = router;
