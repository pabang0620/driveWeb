const {
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
} = require("../models/driveModel");
const { getRecentPosts } = require("../models/postModel");

// 게시글 랭킹
const getRecentPostsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params; // URL parameter에서 boardId를 가져옵니다.
    if (!boardId) {
      return res.status(400).json({ error: "boardId가 필요합니다." });
    }
    const recentPosts = await getRecentPosts(parseInt(boardId, 10));
    res.status(200).json(recentPosts);
  } catch (error) {
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
};

// 랭킹
// 랭킹
// 랭킹
// 랭킹
// 랭킹

// 랭킹
const getTopUsers = async (req, res) => {
  try {
    const { jobtype } = req.body;
    const users = await getTopUsersByDrivingTime(jobtype);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching top users by driving time:", error);
    res.status(500).json({
      error: "유저 정보를 가져오는 중 오류가 발생했습니다: " + error.message,
    });
  }
};

// 순이익 탑
const getTopNetIncomeUsers = async (req, res) => {
  try {
    const { carType } = req.body;
    const users = await getTopUsersByNetIncome(carType);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching top net income users:", error);
    res.status(500).json({
      error: "유저 정보를 가져오는 중 오류가 발생했습니다: " + error.message,
    });
  }
};

// 연비 랭크
const getTopFuelEfficiencyUsers = async (req, res) => {
  try {
    const { fuelType } = req.body;
    const users = await getTopUsersByFuelEfficiency(fuelType);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching top fuel efficiency users:", error);
    res.status(500).json({
      error: "유저 정보를 가져오는 중 오류가 발생했습니다: " + error.message,
    });
  }
};

module.exports = {
  getRecentPostsByBoard,
  getTopUsers,
  getTopNetIncomeUsers,
  getTopFuelEfficiencyUsers,
};
