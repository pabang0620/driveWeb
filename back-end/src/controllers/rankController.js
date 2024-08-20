const {
  getTopPostsByLikesAndViews,
  getTopPostsByBoards,
} = require("../models/postModel");
const {
  getAllRankings,
  updateRankingModel,
  getTopUsersByDrivingTime,
  getTopNetIncomeUsers,
  getTopTotalCasesUsersModel,
  getTopProfitLossUsersModel,
  getTopDrivingDistanceUsersModel,
  getTopUsersByFuelEfficiency,
} = require("../models/rankModel");

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
    const { filterType, filterValue } = req.body; // Using query params for better API design
    const users = await getTopUsersByDrivingTime(filterType, filterValue);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({
      error: "Error fetching top users: " + error.message,
    });
  }
};
// 순수익 랭킹 컨트롤러
const getTopNetIncomeUsersController = async (req, res) => {
  try {
    const { filterType, filterValue } = req.body; // 클라이언트로부터 필터 타입과 값을 받음

    // 모델 함수 호출
    const users = await getTopNetIncomeUsers(filterType, filterValue);

    // 성공적으로 데이터를 받아왔을 때
    res.status(200).json(users);
  } catch (error) {
    // 에러 처리
    console.error("Error fetching top net income users:", error);
    res.status(500).json({
      error: "유저 정보를 가져오는 중 오류가 발생했습니다: " + error.message,
    });
  }
};
// 연비 랭크
const getTopFuelEfficiencyUsers = async (req, res) => {
  try {
    const { filterType, filterValue } = req.body; // Accept filter parameters through query
    const users = await getTopUsersByFuelEfficiency(filterType, filterValue);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching top fuel efficiency users:", error);
    res.status(500).json({
      error: "유저 정보를 가져오는 중 오류가 발생했습니다: " + error.message,
    });
  }
};

// 주행 거리 랭킹
async function topDrivingDistanceUsers(req, res) {
  try {
    const { filterType, filterValue } = req.body; // Using query params for better API design

    const users = await getTopDrivingDistanceUsersModel(
      filterType,
      filterValue
    );
    res.json(users);
  } catch (error) {
    console.error("주행 거리 랭킹 조회 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "주행 거리 랭킹 조회 중 오류 발생: " + error.message });
  }
}

// 총 건수 랭킹
async function topTotalCasesUsers(req, res) {
  try {
    const { filterType, filterValue } = req.body;
    const users = await getTopTotalCasesUsersModel(filterType, filterValue);
    res.json(users);
  } catch (error) {
    console.error("총 건수 랭킹 조회 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "총 건수 랭킹 조회 중 오류 발생: " + error.message });
  }
}

// 순이익 랭킹
async function topProfitLossUsers(req, res) {
  try {
    const { filterType, filterValue } = req.body;
    const users = await getTopProfitLossUsersModel(filterType, filterValue);
    res.json(users);
  } catch (error) {
    console.error("순이익 랭킹 조회 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "순이익 랭킹 조회 중 오류 발생: " + error.message });
  }
}

module.exports = {
  getRankings,
  updateRanking,
  // --관리자 끝 --
  getTopPosts,
  getTopUsers,
  getTopNetIncomeUsers,
  getTopFuelEfficiencyUsers,
  topDrivingDistanceUsers,
  topTotalCasesUsers,
  getTopNetIncomeUsersController,
  topProfitLossUsers,
};
