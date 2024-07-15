const express = require("express");
const {
  getRecentPostsByBoard,
  getTopNetIncomeUsers,
  getTopUsers,
  getTopFuelEfficiencyUsers,
} = require("../controllers/rankController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// 운행시간 탑
/**
 * @swagger
 * /api/rank/top-users:
 *   post:
 *     summary: 운행시간 TOP5
 *     tags: [Ranking]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobtype:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: A list of top users by driving time
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nickname:
 *                     type: string
 *                   totalDrivingTime:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.post("/top-users", authMiddleware, getTopUsers);

/**
 * @swagger
 * /api/rank/top-net-income:
 *   post:
 *     summary: 손익 Top 5
 *     tags: [Ranking]
 *     security:
 *       - BearerAuth: []
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
 *     responses:
 *       200:
 *         description: A list of top users by net income
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nickname:
 *                     type: string
 *                   netIncome:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.post("/top-net-income", authMiddleware, getTopNetIncomeUsers);

/**
 * @swagger
 * /api/rank/top-fuel-efficiency:
 *   post:
 *     summary: 연비 Top 5
 *     tags: [Ranking]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fuelType:
 *                 type: string
 *                 example: "LPG"
 *     responses:
 *       200:
 *         description: A list of top users by fuel efficiency
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nickname:
 *                     type: string
 *                   fuelEfficiency:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.post("/top-fuel-efficiency", authMiddleware, getTopFuelEfficiencyUsers);

// 홈에서 쓰는 게시물 최신
router.get("/top-views/:boardId", getRecentPostsByBoard);
// 홈에서 쓰는 게시물 인기
module.exports = router;
