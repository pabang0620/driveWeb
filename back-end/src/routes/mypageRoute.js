const express = require("express");
const { getMyPageData } = require("../controllers/mypageController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /mypage:
 *   get:
 *     summary: Retrieve user's mypage data
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: The start date for the data range
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: The end date for the data range
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved user's mypage data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   description: The total income of the user
 *                 todayIncome:
 *                   type: number
 *                   description: The total income for today
 *                 totalMileage:
 *                   type: number
 *                   description: The total mileage of the user's vehicle
 *                 todayDrivingDistance:
 *                   type: number
 *                   description: The driving distance for today
 *                 netProfit:
 *                   type: number
 *                   description: The net profit of the user
 *                 todayNetProfit:
 *                   type: number
 *                   description: The net profit for today
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Server error
 */
router.get("/mypage", authMiddleware, getMyPageData);

module.exports = router;
