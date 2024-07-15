const express = require("express");
const {
  addDrivingRecord,
  getDrivingRecords,
  editDrivingRecord,
  removeDrivingRecord,
  addIncomeRecord,
  editIncomeRecord,
  removeIncomeRecord,
  addExpenseRecord,
  editExpenseRecord,
  removeExpenseRecord,
} = require("../controllers/driveController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// 운행일지 - 운행
// 운행 일지 생성
/**
 * @swagger
 * /api/drive/log:
 *   post:
 *     summary: 운행 일지 생성
 *     tags: [운행 일지]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: 운행 일지 날짜
 *               memo:
 *                 type: string
 *                 description: 운행 일지 메모
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: 운행 시작 시간
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: 운행 종료 시간
 *               cumulativeKm:
 *                 type: integer
 *                 description: 누적 주행 거리
 *               businessDistance:
 *                 type: integer
 *                 description: 영업 거리
 *               fuelAmount:
 *                 type: number
 *                 format: double
 *                 description: 연료 소모량
 *               totalDrivingCases:
 *                 type: integer
 *                 description: 총 운행 건수
 *     responses:
 *       201:
 *         description: 운행 기록이 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drivingLogId:
 *                   type: integer
 *                   description: 생성된 운행 일지 ID
 *                 record:
 *                   type: object
 *                   description: 생성된 운행 기록
 *       500:
 *         description: 서버 오류
 */
router.post("/log", authMiddleware, addDrivingRecord);

router.put("/log/:id", authMiddleware, editDrivingRecord);

router.delete("/log/:id", authMiddleware, removeDrivingRecord);

// 운행일지 - 지출
/**
 * @swagger
 * /api/drive/income/{id}:
 *   put:
 *     summary: 수입 기록 수정
 *     tags: [운행 일지 - 수입]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수입 기록 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drivingLogId:
 *                 type: integer
 *                 description: 운행 일지 ID
 *               cardIncome:
 *                 type: number
 *                 format: double
 *                 description: 카드 수입
 *               cashIncome:
 *                 type: number
 *                 format: double
 *                 description: 현금 수입
 *               kakaoIncome:
 *                 type: number
 *                 format: double
 *                 description: 카카오 수입
 *               uberIncome:
 *                 type: number
 *                 format: double
 *                 description: 우버 수입
 *               ondaIncome:
 *                 type: number
 *                 format: double
 *                 description: 온다 수입
 *               tadaIncome:
 *                 type: number
 *                 format: double
 *                 description: 타다 수입
 *               otherIncome:
 *                 type: number
 *                 format: double
 *                 description: 기타 수입
 *               incomeSpare1:
 *                 type: number
 *                 format: double
 *                 description: 예비 수입 1
 *               incomeSpare2:
 *                 type: number
 *                 format: double
 *                 description: 예비 수입 2
 *               incomeSpare3:
 *                 type: number
 *                 format: double
 *                 description: 예비 수입 3
 *               incomeSpare4:
 *                 type: number
 *                 format: double
 *                 description: 예비 수입 4
 *     responses:
 *       200:
 *         description: 수입 기록이 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cardIncome:
 *                   type: number
 *                   format: double
 *                 cashIncome:
 *                   type: number
 *                   format: double
 *                 kakaoIncome:
 *                   type: number
 *                   format: double
 *                 uberIncome:
 *                   type: number
 *                   format: double
 *                 ondaIncome:
 *                   type: number
 *                   format: double
 *                 tadaIncome:
 *                   type: number
 *                   format: double
 *                 otherIncome:
 *                   type: number
 *                   format: double
 *                 incomeSpare1:
 *                   type: number
 *                   format: double
 *                 incomeSpare2:
 *                   type: number
 *                   format: double
 *                 incomeSpare3:
 *                   type: number
 *                   format: double
 *                 incomeSpare4:
 *                   type: number
 *                   format: double
 *                 totalIncome:
 *                   type: number
 *                   format: double
 *                 incomePerKm:
 *                   type: number
 *                   format: double
 *                 incomePerHour:
 *                   type: number
 *                   format: double
 *       500:
 *         description: 서버 오류
 */
router.put("/income/:id", authMiddleware, editIncomeRecord);

router.delete("/income/:id", authMiddleware, removeIncomeRecord);
// 운행일지 - 수익
/**
 * @swagger
 * /api/drive/expense/{id}:
 *   put:
 *     summary: 지출 기록 수정
 *     tags: [운행 일지 - 지출]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 지출 기록 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drivingLogId:
 *                 type: integer
 *                 description: 운행 일지 ID
 *               fuelCost:
 *                 type: number
 *                 format: double
 *                 description: 연료 비용
 *               tollCost:
 *                 type: number
 *                 format: double
 *                 description: 통행료
 *               mealCost:
 *                 type: number
 *                 format: double
 *                 description: 식사 비용
 *               fineCost:
 *                 type: number
 *                 format: double
 *                 description: 벌금 비용
 *               otherExpense:
 *                 type: number
 *                 format: double
 *                 description: 기타 지출
 *               expenseSpare1:
 *                 type: number
 *                 format: double
 *                 description: 예비 지출 1
 *               expenseSpare2:
 *                 type: number
 *                 format: double
 *                 description: 예비 지출 2
 *               expenseSpare3:
 *                 type: number
 *                 format: double
 *                 description: 예비 지출 3
 *               expenseSpare4:
 *                 type: number
 *                 format: double
 *                 description: 예비 지출 4
 *     responses:
 *       200:
 *         description: 지출 기록이 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fuelCost:
 *                   type: number
 *                   format: double
 *                 tollCost:
 *                   type: number
 *                   format: double
 *                 mealCost:
 *                   type: number
 *                   format: double
 *                 fineCost:
 *                   type: number
 *                   format: double
 *                 otherExpense:
 *                   type: number
 *                   format: double
 *                 expenseSpare1:
 *                   type: number
 *                   format: double
 *                 expenseSpare2:
 *                   type: number
 *                   format: double
 *                 expenseSpare3:
 *                   type: number
 *                   format: double
 *                 expenseSpare4:
 *                   type: number
 *                   format: double
 *                 totalExpense:
 *                   type: number
 *                   format: double
 *                 netIncome:
 *                   type: number
 *                   format: double
 *       500:
 *         description: 서버 오류
 */
router.put("/expense/:id", authMiddleware, editExpenseRecord);

router.delete("/expense/:id", authMiddleware, removeExpenseRecord);

module.exports = router;
