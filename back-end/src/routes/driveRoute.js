const express = require("express");
const {
  addDrivingRecord,
  editDrivingRecord,
  removeDrivingRecord,
  editIncomeRecord,
  editExpenseRecord,
  getDrivingLogsForUser,
  getDriveDetails,
  // 운행일지 수정을 위한 get
  fetchDrivingLogWithRecords,
  fetchIncomeRecordByDrivingLogId,
  fetchExpenseRecordByDrivingLogId,
} = require("../controllers/driveController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// 운행일지 - 운행
// 운행 일지 생성

router.post("/log", authMiddleware, addDrivingRecord);

router.delete("/log/:id", authMiddleware, removeDrivingRecord);

router.get("/driving-logs/:userId", adminMiddleware, getDrivingLogsForUser);
router.get("/driving-logs", adminMiddleware, getDrivingLogsForUser);

// 상세
router.get(
  "/driving-logs-detail/:driving_log_id",
  authMiddleware,
  getDriveDetails
);

// 운행일지 수정을 위한 get
router.get(
  "/detail/:driving_log_id",
  authMiddleware,
  fetchDrivingLogWithRecords
);

// 수입 기록 가져오기
router.get(
  "/incomedetail/:driving_log_id",
  authMiddleware,
  fetchIncomeRecordByDrivingLogId
);

// 지출 기록 가져오기
router.get(
  "/expensedetail/:driving_log_id",
  authMiddleware,
  fetchExpenseRecordByDrivingLogId
);

router.put("/detail/:drivingLogId", authMiddleware, editDrivingRecord);

router.put("/income/:driving_log_id", authMiddleware, editIncomeRecord);

router.put("/expense/:driving_log_id", authMiddleware, editExpenseRecord);

module.exports = router;
