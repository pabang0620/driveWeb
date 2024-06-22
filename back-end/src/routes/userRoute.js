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
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - nickname
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", loginUser);

router.post("/google-login", googleLogin);
router.post("/kakao-login", kakaoLogin);
router.post("/naver-login", naverLogin);

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

module.exports = router;
