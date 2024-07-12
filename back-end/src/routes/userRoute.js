const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
  kakaoLogin,
  naverLogin,
  addUserVehicle,
  addUserProfile,
  addUserIncome,
  addFranchiseFee,
  editFranchiseFee,
  removeFranchiseFee,
  fetchUserProfile,
  fetchUserVehiclesWithFees,
  fetchUserIncomeRecords,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/google-login", googleLogin);
router.post("/kakao-login", kakaoLogin);
router.post("/naver-login", naverLogin);

// 회원정보
/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: 회원 개인 정보 조회
 *     tags: [UserProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 회원 정보를 조회했습니다.
 *       404:
 *         description: 회원 정보를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */
router.get("/profile", authMiddleware, fetchUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   post:
 *     summary: 회원정보 - 개인정보
 *     tags: [UserProfile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User profile added successfully
 *       500:
 *         description: Server error
 */
router.post("/profile", authMiddleware, addUserProfile);
/**
 * @swagger
 * /api/user/vehicles:
 *   get:
 *     summary: 회원 차량 정보 및 가맹점 수수료 조회
 *     tags: [UserVehicle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 회원 차량 정보를 조회했습니다.
 *       500:
 *         description: 서버 오류
 */
router.get("/vehicles", authMiddleware, fetchUserVehiclesWithFees);
/**
 * @swagger
 * /api/user/vehicle:
 *   post:
 *     summary: 회원정보 - 차량정보
 *     tags: [UserVehicle]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxi_type:
 *                 type: string
 *               franchise_status:
 *                 type: string
 *               vehicle_name:
 *                 type: string
 *               year:
 *                 type: integer
 *               fuel_type:
 *                 type: string
 *               mileage:
 *                 type: integer
 *               commission_rate:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: User vehicle added successfully
 *       500:
 *         description: Server error
 */
router.post("/vehicle", authMiddleware, addUserVehicle);
/**
 * @swagger
 * /api/user/income:
 *   get:
 *     summary: 회원 수입 정보 조회
 *     tags: [IncomeRecords]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 회원 수입 정보를 조회했습니다.
 *       500:
 *         description: 서버 오류
 */
router.get("/income", authMiddleware, fetchUserIncomeRecords);
/**
 * @swagger
 * /api/user/income:
 *   post:
 *     summary: 회원정보 - 소득정보
 *     tags: [UserIncome]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               income_type:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               region1:
 *                 type: string
 *               region2:
 *                 type: string
 *               monthly_payment:
 *                 type: number
 *                 format: float
 *               fuel_allowance:
 *                 type: number
 *                 format: float
 *               investment:
 *                 type: number
 *                 format: float
 *               standard_expense_rate:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: User income added successfully
 *       500:
 *         description: Server error
 */
router.post("/income", authMiddleware, addUserIncome);

// 수수료 // 수수료 // 수수료 // 수수료
/**
 * @swagger
 * /api/user/franchise-fee:
 *   post:
 *     summary: 가맹점 수수료 생성
 *     tags: [FranchiseFee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               franchiseName:
 *                 type: string
 *               fee:
 *                 type: number
 *                 format: double
 *     responses:
 *       201:
 *         description: 가맹점 수수료가 성공적으로 생성되었습니다.
 *       500:
 *         description: 서버 오류
 */
router.post("/franchise-fee", authMiddleware, addFranchiseFee);

/**
 * @swagger
 * /api/user/franchise-fee/{id}:
 *   put:
 *     summary: 가맹점 수수료 수정
 *     tags: [FranchiseFee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 가맹점 수수료 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               franchiseName:
 *                 type: string
 *               fee:
 *                 type: number
 *                 format: double
 *     responses:
 *       200:
 *         description: 성공적으로 가맹점 수수료를 수정했습니다.
 *       500:
 *         description: 서버 오류
 */
router.put("/franchise-fee/:id", editFranchiseFee);

/**
 * @swagger
 * /api/user/franchise-fee/{id}:
 *   delete:
 *     summary: 가맹점 수수료 삭제
 *     tags: [FranchiseFee]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 가맹점 수수료 ID
 *     responses:
 *       200:
 *         description: 성공적으로 가맹점 수수료를 삭제했습니다.
 *       500:
 *         description: 서버 오류
 */
router.delete("/franchise-fee/:id", removeFranchiseFee);
// 회원정보 - 차량정보
module.exports = router;
