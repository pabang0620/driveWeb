const express = require("express");
const {
  addDrivingRecord,
  editDrivingRecord,
  removeDrivingRecord,
  editIncomeRecord,
  removeIncomeRecord,
  editExpenseRecord,
  removeExpenseRecord,
  getDrivingLogsForUser,
  getDriveDetails,
} = require("../controllers/driveController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// 운행일지 - 운행
// 운행 일지 생성

router.post("/log", authMiddleware, addDrivingRecord);

router.put("/log/:id", authMiddleware, editDrivingRecord);

router.delete("/log/:id", authMiddleware, removeDrivingRecord);

router.put("/income/:driving_log_id", authMiddleware, editIncomeRecord);

router.put("/expense/:driving_log_id", authMiddleware, editExpenseRecord);

router.get("/driving-logs", authMiddleware, getDrivingLogsForUser);

router.get("/driving-logs/:driving_log_id", authMiddleware, getDriveDetails);

module.exports = router;
