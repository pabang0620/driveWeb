const express = require("express");
const {
  getTopNetIncomeUsers,
  getTopUsers,
  getTopFuelEfficiencyUsers,
  getTopPosts,
  getRankings,
  updateRanking,
  topProfitLossUsers,
  topTotalCasesUsers,
  topDrivingDistanceUsers,
} = require("../controllers/rankController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// 운행시간 탑
router.get("/list", getRankings);

router.put("/list/:id", updateRanking);

router.post("/top-users", getTopUsers);
router.post("/top-net-income", getTopNetIncomeUsers);
router.post("/top-fuel-efficiency", getTopFuelEfficiencyUsers);
router.post("/driving-distance", topDrivingDistanceUsers);
router.post("/total-cases", topTotalCasesUsers);
router.post("/profit-loss", topProfitLossUsers);
// 홈에서 쓰는 게시물 최신
router.get("/topRank", getTopPosts);

// 홈에서 쓰는 게시물 인기
module.exports = router;
