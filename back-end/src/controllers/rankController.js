const {
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
} = require("../models/driveModel");
const {
  getRecentPosts,
  getTopPostsByLikesAndViews,
  getTopPostsByBoards,
} = require("../models/postModel");

// 게시글 랭킹
const getTopPosts = async (req, res) => {
  try {
    const { topLikedPosts, topViewedPosts } =
      await getTopPostsByLikesAndViews();
    const boardsWithPosts = await getTopPostsByBoards();

    res.status(200).json({ topLikedPosts, topViewedPosts, boardsWithPosts });
  } catch (error) {
    console.error("Error fetching top posts:", error); // 오류 메시지를 콘솔에 기록
    res
      .status(500)
      .json({
        error: "인기 게시글 조회 중 오류가 발생했습니다.",
        details: error.message,
      }); // 상세 오류 메시지를 응답에 포함
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
  getTopPosts,
  getTopUsers,
  getTopNetIncomeUsers,
  getTopFuelEfficiencyUsers,
};
