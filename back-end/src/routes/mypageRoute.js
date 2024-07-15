const express = require("express");
const {
  getMyPageData,
  getExpenseSummary,
  getIncomeSummary,
  getSummaryData,
} = require("../controllers/mypageController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/mypage/{startDate}/{endDate}:
 *   get:
 *     summary: 상단에 데이터에용
 *     tags: [마이페이지]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         description: The start date for the data range
 *         schema:
 *           type: string
 *           format: date
 *       - in: path
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
 *         description: Missing required path parameters
 *       500:
 *         description: Server error
 */
router.get("/:startDate/:endDate", authMiddleware, getMyPageData);

// 지출 요약 데이터 조회
/**
 * @swagger
 * /api/mypage/expense-summary/{startDate}/{endDate}:
 *   get:
 *     summary: 날짜 범위에 따른 지출 요약 데이터 조회 (원차트에용)
 *     tags: [마이페이지]
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: 조회 시작 날짜 (YYYY-MM-DD 형식)
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: 조회 종료 날짜 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 지출 요약 데이터 조회 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.get(
  "/expense-summary/:startDate/:endDate",
  authMiddleware,
  getExpenseSummary
);
// 수입 요약 데이터 조회
/**
 * @swagger
 * /api/mypage/income-summary/{startDate}/{endDate}:
 *   get:
 *     summary: 날짜 범위에 따른 수입 요약 데이터 조회 (원차트에용)
 *     tags: [마이페이지]
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: 조회 시작 날짜 (YYYY-MM-DD 형식)
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: 조회 종료 날짜 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 수입 요약 데이터 조회 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.get(
  "/income-summary/:startDate/:endDate",
  authMiddleware,
  getIncomeSummary
);
/**
 * @swagger
 * /api/mypage/mixChart/{startDate}/{endDate}:
 *   get:
 *     summary: 지정된 기간 동안의 주행거리, 근무시간, 총 수익금 조회 (혼합차트에용) 화이팅 ~!
 *     tags: [마이페이지]
 *     parameters:
 *       - in: path
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: 시작 날짜 (YYYY-MM-DD 형식)
 *       - in: path
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: 종료 날짜 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 지정된 기간 동안의 요약 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drivingDistance:
 *                   type: number
 *                   description: 총 주행거리
 *                 workingHours:
 *                   type: number
 *                   description: 총 근무시간
 *                 totalIncome:
 *                   type: number
 *                   description: 총 수익금
 *       500:
 *         description: 서버 오류
 */
router.get("/mixChart/:startDate/:endDate", authMiddleware, getSummaryData);

module.exports = router;
