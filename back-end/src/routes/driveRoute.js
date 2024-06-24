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
/**
 * @swagger
 * /api/drive/log:
 *   post:
 *     summary: 운행 일지 등록
 *     tags: [운행일지 - 운행]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drivingLogId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               cumulativeKm:
 *                 type: integer
 *               businessDistance:
 *                 type: integer
 *               fuelAmount:
 *                 type: number
 *                 format: double
 *               totalDrivingCases:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 운행 기록이 성공적으로 생성되었습니다.
 *       500:
 *         description: 서버 오류
 */
router.post("/log", authMiddleware, addDrivingRecord);
/**
 * @swagger
 * /api/drive/log/{id}:
 *   put:
 *     summary: 운행 일지 수정
 *     tags: [운행일지 - 운행]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 운행 기록 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               cumulativeKm:
 *                 type: integer
 *               businessDistance:
 *                 type: integer
 *               fuelAmount:
 *                 type: number
 *                 format: double
 *               totalDrivingCases:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 성공적으로 운행 기록을 수정했습니다.
 *       500:
 *         description: 서버 오류
 */
router.put("/log/:id", authMiddleware, editDrivingRecord);
/**
 * @swagger
 * /api/drive/log/{id}:
 *   delete:
 *     summary: 운행 일지 삭제
 *     tags: [운행일지 - 운행]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 운행 기록 ID
 *     responses:
 *       200:
 *         description: 성공적으로 운행 기록을 삭제했습니다.
 *       500:
 *         description: 서버 오류
 */
router.delete("/log/:id", authMiddleware, removeDrivingRecord);
// 운행일지 - 수입
/**
 * @swagger
 * /api/drive/income:
 *   post:
 *     summary: 수입 기록 생성
 *     tags: [운행일지 - 수입]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drivingLogId:
 *                 type: integer
 *               cardIncome:
 *                 type: number
 *                 format: double
 *               cashIncome:
 *                 type: number
 *                 format: double
 *               kakaoIncome:
 *                 type: number
 *                 format: double
 *               uberIncome:
 *                 type: number
 *                 format: double
 *               ondaIncome:
 *                 type: number
 *                 format: double
 *               tadaIncome:
 *                 type: number
 *                 format: double
 *               otherIncome:
 *                 type: number
 *                 format: double
 *               incomeSpare1:
 *                 type: number
 *                 format: double
 *               incomeSpare2:
 *                 type: number
 *                 format: double
 *               incomeSpare3:
 *                 type: number
 *                 format: double
 *               incomeSpare4:
 *                 type: number
 *                 format: double
 *     responses:
 *       201:
 *         description: 수입 기록이 성공적으로 생성되었습니다.
 *       500:
 *         description: 서버 오류
 */
router.post("/income", authMiddleware, addIncomeRecord);
/**
 * @swagger
 * /api/drive/income/{id}:
 *   put:
 *     summary: 수입 기록 수정
 *     tags: [운행일지 - 수입]
 *     security:
 *       - bearerAuth: []
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
 *               cardIncome:
 *                 type: number
 *                 format: double
 *               cashIncome:
 *                 type: number
 *                 format: double
 *               kakaoIncome:
 *                 type: number
 *                 format: double
 *               uberIncome:
 *                 type: number
 *                 format: double
 *               ondaIncome:
 *                 type: number
 *                 format: double
 *               tadaIncome:
 *                 type: number
 *                 format: double
 *               otherIncome:
 *                 type: number
 *                 format: double
 *               incomeSpare1:
 *                 type: number
 *                 format: double
 *               incomeSpare2:
 *                 type: number
 *                 format: double
 *               incomeSpare3:
 *                 type: number
 *                 format: double
 *               incomeSpare4:
 *                 type: number
 *                 format: double
 *     responses:
 *       200:
 *         description: 성공적으로 수입 기록을 수정했습니다.
 *       500:
 *         description: 서버 오류
 */
router.put("/income/:id", authMiddleware, editIncomeRecord);
/**
 * @swagger
 * /api/drive/income/{id}:
 *   delete:
 *     summary: 수입 기록 삭제
 *     tags: [운행일지 - 수입]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수입 기록 ID
 *     responses:
 *       200:
 *         description: 성공적으로 수입 기록을 삭제했습니다.
 *       500:
 *         description: 서버 오류
 */
router.delete("/income/:id", authMiddleware, removeIncomeRecord);
// 운행일지 - 지출
/**
 * @swagger
 * /api/drive/expense:
 *   post:
 *     summary: 지출 기록 생성
 *     tags: [운행일지 - 지출]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drivingLogId:
 *                 type: integer
 *               fuelCost:
 *                 type: number
 *                 format: double
 *               tollCost:
 *                 type: number
 *                 format: double
 *               mealCost:
 *                 type: number
 *                 format: double
 *               fineCost:
 *                 type: number
 *                 format: double
 *               otherExpense:
 *                 type: number
 *                 format: double
 *               expenseSpare1:
 *                 type: number
 *                 format: double
 *               expenseSpare2:
 *                 type: number
 *                 format: double
 *               expenseSpare3:
 *                 type: number
 *                 format: double
 *               expenseSpare4:
 *                 type: number
 *                 format: double
 *     responses:
 *       201:
 *         description: 지출 기록이 성공적으로 생성되었습니다.
 *       500:
 *         description: 서버 오류
 */
router.post("/expense", authMiddleware, addExpenseRecord);
/**
 * @swagger
 * /api/drive/expense/{id}:
 *   put:
 *     summary: 지출 기록 수정
 *     tags: [운행일지 - 지출]
 *     security:
 *       - bearerAuth: []
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
 *               cardFee:
 *                 type: number
 *                 format: double
 *               kakaoFee:
 *                 type: number
 *                 format: double
 *               uberFee:
 *                 type: number
 *                 format: double
 *               fuelCost:
 *                 type: number
 *                 format: double
 *               tollCost:
 *                 type: number
 *                 format: double
 *               mealCost:
 *                 type: number
 *                 format: double
 *               fineCost:
 *                 type: number
 *                 format: double
 *               otherExpense:
 *                 type: number
 *                 format: double
 *               expenseSpare1:
 *                 type: number
 *                 format: double
 *               expenseSpare2:
 *                 type: number
 *                 format: double
 *               expenseSpare3:
 *                 type: number
 *                 format: double
 *               expenseSpare4:
 *                 type: number
 *                 format: double
 *     responses:
 *       200:
 *         description: 성공적으로 지출 기록을 수정했습니다.
 *       500:
 *         description: 서버 오류
 */
router.put("/expense/:id", authMiddleware, editExpenseRecord);
/**
 * @swagger
 * /api/drive/expense/{id}:
 *   delete:
 *     summary: 지출 기록 삭제
 *     tags: [운행일지 - 지출]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 지출 기록 ID
 *     responses:
 *       200:
 *         description: 성공적으로 지출 기록을 삭제했습니다.
 *       500:
 *         description: 서버 오류
 */
router.delete("/expense/:id", authMiddleware, removeExpenseRecord);

module.exports = router;
