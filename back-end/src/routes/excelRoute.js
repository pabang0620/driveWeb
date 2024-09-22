const express = require("express");
const multer = require("multer");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// 메모리에서 파일을 처리하는 Multer 설정
const upload = multer({ storage: multer.memoryStorage() });

const {
  getDrivingLogsForExcel,
  uploadExcel,
  getDrivingLogsForExcelAdmin,
} = require("../controllers/excelController");
const adminDriver = require("../middleware/adminDriver");

// 운행 일지 데이터를 엑셀로 다운로드
router.get("/", authMiddleware, getDrivingLogsForExcel);
router.get("/:userId", getDrivingLogsForExcelAdmin);

// 엑셀 파일 업로드 및 데이터베이스에 저장
router.post("/upload-excel", upload.single("file"), adminDriver, uploadExcel);

module.exports = router;
