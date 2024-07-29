const {
  getTotalIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
  getTodayIncome,
  getExpenseRecordsByDateRange,
  getIncomeRecordsByDateRange,
  getWorkingHours,
  getDrivingDistance,
  getTotalIncomeForPeriod,
  getDrivingRecordsByDateRange,
} = require("../models/mypageModel");

const getMyPageData = async (req, res) => {
  try {
    const { userId } = req; // 로그인된 사용자의 ID를 가져옵니다.
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 하루의 끝 시간으로 설정

    const totalIncome = await getTotalIncome(userId, start, end);
    const todayIncome = await getTodayIncome(userId);
    const totalMileage = await getTotalMileage(userId, start, end);
    const todayDrivingDistance = await getTodayDrivingDistance(userId);
    const totalExpense = await getTotalExpense(userId, start, end);
    const todayExpense = await getTodayExpense(userId);

    const netProfit = totalIncome - totalExpense;
    const todayNetProfit = todayIncome - todayExpense;

    res.status(200).json({
      totalIncome,
      todayIncome,
      totalMileage,
      todayDrivingDistance,
      netProfit,
      todayNetProfit,
    });
  } catch (error) {
    console.error("Error fetching mypage data:", error);
    res.status(500).json({ error: "Error fetching mypage data" });
  }
};
const getExpenseSummary = async (req, res) => {
  try {
    const { userId } = req; // 로그인된 사용자의 ID를 가져옵니다.
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const expenseSummary = await getExpenseRecordsByDateRange(
      userId,
      startDate,
      endDate
    );

    res.status(200).json(expenseSummary);
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    res.status(500).json({ error: "Error fetching expense summary" });
  }
};
const getIncomeSummary = async (req, res) => {
  try {
    const { userId } = req; // 로그인된 사용자의 ID를 가져옵니다.
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const incomeSummary = await getIncomeRecordsByDateRange(
      userId,
      startDate,
      endDate
    );

    res.status(200).json(incomeSummary);
  } catch (error) {
    console.error("Error fetching income summary:", error);
    res.status(500).json({ error: "Error fetching income summary" });
  }
};

const getDrivingSummary = async (req, res) => {
  try {
    const { userId } = req; // 로그인된 사용자의 ID를 가져옵니다.
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const drivingSummary = await getDrivingRecordsByDateRange(
      userId,
      startDate,
      endDate
    );

    res.status(200).json(drivingSummary);
  } catch (error) {
    console.error("Error fetching driving summary:", error);
    res.status(500).json({ error: "Error fetching driving summary" });
  }
};
module.exports = {
  getMyPageData,
  getExpenseSummary,
  getIncomeSummary,
  getDrivingSummary,
};
