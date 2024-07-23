const express = require("express");
const {
  getRecentPostsByBoard,
  getTopNetIncomeUsers,
  getTopUsers,
  getTopFuelEfficiencyUsers,
} = require("../controllers/rankController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// 운행시간 탑

router.post("/top-users", authMiddleware, getTopUsers);

router.post("/top-net-income", authMiddleware, getTopNetIncomeUsers);

router.post("/top-fuel-efficiency", authMiddleware, getTopFuelEfficiencyUsers);

// 홈에서 쓰는 게시물 최신
router.get("/top-views/:boardId", getRecentPostsByBoard);
// 홈에서 쓰는 게시물 인기
module.exports = router;
