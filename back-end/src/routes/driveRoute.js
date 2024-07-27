const express = require("express");
const {
  addDrivingRecord,
  editDrivingRecord,
  removeDrivingRecord,
  editIncomeRecord,
  removeIncomeRecord,
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

router.put("/income/:id", authMiddleware, editIncomeRecord);

router.put("/expense/:id", authMiddleware, editExpenseRecord);

module.exports = router;
