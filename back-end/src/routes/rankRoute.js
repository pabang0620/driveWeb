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
 *     summary: Fetch top users by driving time
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
 *                 type: string
 *                 example: "driver"
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
 *     summary: Fetch top users by net income
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
 *                 example: "sedan"
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
 *     summary: Fetch top users by fuel efficiency
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
 *                 example: "diesel"
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
