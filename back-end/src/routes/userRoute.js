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
  getFranchiseFees,
  verifySecurityAnswer,
  resetPassword,
  updateJobType,
  findUsername,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const handleFileUpload = require("../middleware/handleFileUpload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/resetpassword", resetPassword);

router.post("/verifysecurity", verifySecurityAnswer);
router.post("/findusername", findUsername);

router.get("/profile", authMiddleware, fetchUserProfile);

router.put("/profile", authMiddleware, handleFileUpload, updateUserProfile);

router.get("/vehicles", authMiddleware, fetchUserVehiclesWithFees);

router.put("/vehicles", authMiddleware, updateUserVehicleHandler);
// 지출
router.get("/income", authMiddleware, fetchUserIncomeRecords);

router.put("/income", authMiddleware, updateUserIncome);
// 수수료
router.get("/franchise-fee", authMiddleware, getFranchiseFees);

router.post("/franchise-fee", authMiddleware, addFranchiseFee);

router.delete("/franchise-fee/:id", authMiddleware, removeFranchiseFee);

router.put("/jobtype", authMiddleware, updateJobType);

router.get("/payprofile", authMiddleware, fetchUserProfile);

module.exports = router;
