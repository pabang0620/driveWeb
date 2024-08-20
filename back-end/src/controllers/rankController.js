const {
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
} = require("../models/driveModel");
const {
  getTopPostsByLikesAndViews,
  getTopPostsByBoards,
} = require("../models/postModel");
const { getAllRankings, updateRankingModel } = require("../models/rankModel");
// 관리자모드 설정
const getRankings = async (req, res) => {
  try {
    const rankings = await getAllRankings();
    res.status(200).json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({
      error: "랭킹 정보를 가져오는 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};
const updateRanking = async (req, res) => {
  const { id } = req.params;
  const { name, show_number, filter_number } = req.body;
  // console.log(id, name, show_number, filter_number);
  try {
    const updatedRanking = await updateRankingModel(id, {
      name,
      show_number,
      filter_number,
    });
    res.json(updatedRanking);
  } catch (error) {
    console.error("Error updating ranking:", error);
    res.status(500).json({
      error: "랭킹 정보를 업데이트하는 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};
// 게시글 랭킹
const getTopPosts = async (req, res) => {
  try {
    const { topLikedPosts, topViewedPosts } =
      await getTopPostsByLikesAndViews();
    const boardsWithPosts = await getTopPostsByBoards();

    res.status(200).json({ topLikedPosts, topViewedPosts, boardsWithPosts });
  } catch (error) {
    console.error("Error fetching top posts:", error); // 오류 메시지를 콘솔에 기록
    res.status(500).json({
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
  getRankings,
  updateRanking,
  // --관리자 끝 --
  getTopPosts,
  getTopUsers,
  getTopNetIncomeUsers,
  getTopFuelEfficiencyUsers,
};
