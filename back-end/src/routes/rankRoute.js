const express = require("express");
const {
  getTopNetIncomeUsers,
  getTopUsers,
  getTopFuelEfficiencyUsers,
  getTopPosts,
  getRankings,
  updateRanking,
} = require("../controllers/rankController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// 운행시간 탑
router.get("/list", getRankings);

router.put("/list/:id", updateRanking);

router.post("/top-users", authMiddleware, getTopUsers);

router.post("/top-net-income", authMiddleware, getTopNetIncomeUsers);

router.post("/top-fuel-efficiency", authMiddleware, getTopFuelEfficiencyUsers);

// 홈에서 쓰는 게시물 최신
router.get("/topRank", getTopPosts);
// 홈에서 쓰는 게시물 인기
module.exports = router;
