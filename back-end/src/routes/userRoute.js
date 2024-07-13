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

router.get("/profile", authMiddleware, fetchUserProfile);

router.post("/profile", authMiddleware, addUserProfile);

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Fetch user vehicles with fees
 *     security:
 *       - bearerAuth: []
 *     tags: [차량 정보]
 *     responses:
 *       200:
 *         description: A list of user vehicles with fees
 *       500:
 *         description: Server error
 */
router.get("/vehicles", authMiddleware, fetchUserVehiclesWithFees);

/**
 * @swagger
 * /vehicle:
 *   post:
 *     summary: Add a new vehicle
 *     security:
 *       - bearerAuth: []
 *     tags: [차량 정보]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_name:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               year:
 *                 type: integer
 *               mileage:
 *                 type: integer
 *               license_plate:
 *                 type: string
 *               first_registration_date:
 *                 type: string
 *                 format: date
 *               insurance_company:
 *                 type: string
 *               insurance_period:
 *                 type: string
 *                 format: date
 *               insurance_fee:
 *                 type: number
 *                 format: double
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       500:
 *         description: Server error
 */
router.post("/vehicle", authMiddleware, addUserVehicle);

/**
 * @swagger
 * /income:
 *   get:
 *     summary: Fetch user income records
 *     security:
 *       - bearerAuth: []
 *     tags: [지출 정보]
 *     responses:
 *       200:
 *         description: A list of user income records
 *       500:
 *         description: Server error
 */
router.get("/income", authMiddleware, fetchUserIncomeRecords);

/**
 * @swagger
 * /income:
 *   post:
 *     summary: Add new income record
 *     security:
 *       - bearerAuth: []
 *     tags: [지출 정보]
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
 *                 format: double
 *               fuel_allowance:
 *                 type: number
 *                 format: double
 *               investment:
 *                 type: number
 *                 format: double
 *               standard_expense_rate:
 *                 type: number
 *                 format: double
 *     responses:
 *       201:
 *         description: Income record created successfully
 *       500:
 *         description: Server error
 */
router.post("/income", authMiddleware, addUserIncome);

/**
 * @swagger
 * /franchise-fee:
 *   post:
 *     summary: Add new franchise fee
 *     security:
 *       - bearerAuth: []
 *     tags: [차량정보 - 수수료]
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
 *       201:
 *         description: Franchise fee created successfully
 *       500:
 *         description: Server error
 */
router.post("/franchise-fee", authMiddleware, addFranchiseFee);

/**
 * @swagger
 * /franchise-fee/{id}:
 *   put:
 *     summary: Update franchise fee
 *     tags: [차량정보 - 수수료]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Franchise fee ID
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
 *         description: Franchise fee updated successfully
 *       500:
 *         description: Server error
 */
router.put("/franchise-fee/:id", authMiddleware, editFranchiseFee);

/**
 * @swagger
 * /franchise-fee/{id}:
 *   delete:
 *     summary: Delete franchise fee
 *     tags: [차량정보 - 수수료]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Franchise fee ID
 *     responses:
 *       200:
 *         description: Franchise fee deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/franchise-fee/:id", authMiddleware, removeFranchiseFee);

module.exports = router;
