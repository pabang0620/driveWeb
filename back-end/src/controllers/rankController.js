const {
  getTopFuelEfficiency,
  getTopWorkingHours,
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

// 연비 랭킹 컨트롤러
const getFuelEfficiencyRanking = async (req, res) => {
  try {
    const { fuelType } = req.params; // URL parameter에서 fuelType을 받음
    const topFuelEfficiency = await getTopFuelEfficiency(fuelType);
    res.status(200).json(topFuelEfficiency);
  } catch (error) {
    res.status(500).json({ error: "연비 랭킹 조회 중 오류가 발생했습니다." });
  }
};

// 운행시간 랭킹 컨트롤러
const getWorkingHoursRanking = async (req, res) => {
  try {
    const { jobType } = req.params; // URL parameter에서 jobType을 받음
    const topWorkingHours = await getTopWorkingHours(parseInt(jobType, 10));
    res.status(200).json(topWorkingHours);
  } catch (error) {
    res
      .status(500)
      .json({ error: "운행시간 랭킹 조회 중 오류가 발생했습니다." });
  }
};
module.exports = {
  getRecentPostsByBoard,
  getFuelEfficiencyRanking,
  getWorkingHoursRanking,
};
