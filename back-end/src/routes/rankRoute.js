const express = require("express");
const {
  getRecentPostsByBoard,
  getFuelEfficiencyRanking,
  getWorkingHoursRanking,
} = require("../controllers/rankController");

const router = express.Router();

router.get("/fuel-efficiency/:fuelType", getFuelEfficiencyRanking);
router.get("/working-hours/:jobType", getWorkingHoursRanking);

// 홈에서 쓰는 게시물 최신
router.get("/top-views/:boardId", getRecentPostsByBoard);
// 홈에서 쓰는 게시물 인기
module.exports = router;
