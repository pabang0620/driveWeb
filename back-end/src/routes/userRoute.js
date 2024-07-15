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
  addUserVehicleHandler,
  updateUserProfile,
  updateUserIncome,
  updateUserVehicleHandler,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/google-login", googleLogin);
router.post("/kakao-login", kakaoLogin);
router.post("/naver-login", naverLogin);

router.get("/profile", authMiddleware, fetchUserProfile);

router.put("/profile", authMiddleware, updateUserProfile);

router.get("/vehicles", authMiddleware, fetchUserVehiclesWithFees);

/**
 * @swagger
 * /api/user/vehicle:
 *   post:
 *     summary: "회원 차량 정보 추가"
 *     description: "새로운 회원 차량 정보를 추가합니다."
 *     tags: [차량정보 및 수수료]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carType:
 *                 type: string
 *                 example: "택시(중형)"
 *               franchise_status:
 *                 type: string
 *                 example: "가맹"
 *               commission_rate:
 *                 type: number
 *                 format: float
 *                 example: 10.5
 *               vehicle_name:
 *                 type: string
 *                 example: "토요타 프리우스"
 *               year:
 *                 type: integer
 *                 example: 2020
 *               fuel_type:
 *                 type: string
 *                 example: "LPG"
 *               mileage:
 *                 type: integer
 *                 example: "누적 거리"
 *     responses:
 *       201:
 *         description: "성공적으로 회원 차량 정보가 추가되었습니다."
 *       500:
 *         description: "회원 차량 정보를 추가하는 중 오류가 발생했습니다."
 */
router.put("/vehicles", authMiddleware, updateUserVehicleHandler);

router.get("/income", authMiddleware, fetchUserIncomeRecords);

/**
 * @swagger
 * /api/user/income:
 *   post:
 *     summary: "회원 소득 정보 추가"
 *     description: "새로운 회원 소득 정보를 추가합니다."
 *     tags: [지출 정보 POST]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               income_type:
 *                 type: string
 *                 example: "소득구분"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "개업일"
 *               region1:
 *                 type: string
 *                 example: "서울특별시"
 *               region2:
 *                 type: string
 *                 example: "강남구"
 *               monthly_payment:
 *                 type: number
 *                 example: 3000000
 *               fuel_allowance:
 *                 type: number
 *                 example: 200000
 *               investment:
 *                 type: number
 *                 example: 500000
 *               standard_expense_rate:
 *                 type: number
 *                 example: 10.5
 *     responses:
 *       201:
 *         description: "성공적으로 회원 소득 정보가 추가되었습니다."
 *       500:
 *         description: "회원 소득 정보를 추가하는 중 오류가 발생했습니다."
 */
router.put("/income", authMiddleware, updateUserIncome);

/**
 * @swagger
 * /api/user/franchise-fee:
 *   post:
 *     summary: "가맹점 수수료율 추가"
 *     description: "새로운 가맹점 수수료율을 추가합니다."
 *     tags: [차량정보 및 수수료]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               franchise_name:
 *                 type: string
 *                 example: "카카오"
 *               fee:
 *                 type: number
 *                 format: float
 *                 example: 5
 *     responses:
 *       201:
 *         description: "성공적으로 가맹점 수수료율이 추가되었습니다."
 *       500:
 *         description: "가맹점 수수료율을 추가하는 중 오류가 발생했습니다."
 */
router.post("/franchise-fee", authMiddleware, addFranchiseFee);
/**
 * @swagger
 * /api/user/franchise-fee/{id}:
 *   delete:
 *     summary: "가맹점 수수료율 삭제"
 *     description: "기존의 가맹점 수수료율을 삭제합니다."
 *     tags: [차량정보 및 수수료]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "가맹점 수수료율 ID"
 *     responses:
 *       200:
 *         description: "성공적으로 가맹점 수수료율이 삭제되었습니다."
 *       500:
 *         description: "가맹점 수수료율을 삭제하는 중 오류가 발생했습니다."
 */
router.delete("/franchise-fee/:id", authMiddleware, removeFranchiseFee);

module.exports = router;
