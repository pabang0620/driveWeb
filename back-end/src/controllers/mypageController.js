const {
  getTotalIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
  getTodayIncome,
  getExpenseRecordsByDateRange,
  getIncomeRecordsByDateRange,
  getDrivingRecordsByDateRange,
  getDrivingRecordsByDate,
} = require("../models/mypageModel");

const formatDateToYYYYMMDD = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

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

    const startDateString = formatDateToYYYYMMDD(start);
    const endDateString = formatDateToYYYYMMDD(end);

    // console.log("Fetching data for period:", startDateString, endDateString);

    // 총 수입, 총 주행거리, 총 비용
    const totalIncome = await getTotalIncome(
      userId,
      startDateString,
      endDateString
    );
    // console.log("Total Income:", totalIncome);

    const totalMileage = await getTotalMileage(
      userId,
      startDateString,
      endDateString
    );
    // console.log("Total Mileage:", totalMileage);

    const totalExpense = await getTotalExpense(
      userId,
      startDateString,
      endDateString
    );
    // console.log("Total Expense:", totalExpense);

    const netProfit = totalIncome - totalExpense;

    // endDate 기준 당일 수입, 주행거리, 비용
    const todayIncome = await getTodayIncome(userId, endDateString);
    // console.log("Today Income:", todayIncome);

    const todayDrivingDistance = await getTodayDrivingDistance(
      userId,
      endDateString
    );
    // console.log("Today Driving Distance:", todayDrivingDistance);

    const todayExpense = await getTodayExpense(userId, endDateString);
    // console.log("Today Expense:", todayExpense);

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

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 하루의 끝 시간으로 설정

    const startDateString = formatDateToYYYYMMDD(start);
    const endDateString = formatDateToYYYYMMDD(end);

    const expenseSummary = await getExpenseRecordsByDateRange(
      userId,
      startDateString,
      endDateString
    );
    // console.log("Expense Summary:", expenseSummary);

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

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 하루의 끝 시간으로 설정

    const startDateString = formatDateToYYYYMMDD(start);
    const endDateString = formatDateToYYYYMMDD(end);

    const incomeSummary = await getIncomeRecordsByDateRange(
      userId,
      startDateString,
      endDateString
    );
    // console.log("Income Summary:", incomeSummary);

    res.status(200).json(incomeSummary);
  } catch (error) {
    console.error("Error fetching income summary:", error);
    res.status(500).json({ error: "Error fetching income summary" });
  }
};

// 혼합차트
const getDatesForLastWeek = (endDate) => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  return dates;
};

const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime());
  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

const getDrivingSummary = async (req, res) => {
  try {
    const { userId } = req; // 로그인된 사용자의 ID를 가져옵니다.
    let { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 하루의 끝 시간으로 설정

    let datesInRange;

    // Check if startDate and endDate are the same
    if (startDate === endDate) {
      datesInRange = getDatesForLastWeek(end);
    } else {
      datesInRange = getDatesInRange(start, end);
    }

    const dateStrings = datesInRange.map((date) => formatDateToYYYYMMDD(date));

    const drivingSummaries = await Promise.all(
      dateStrings.map((dateString) =>
        getDrivingRecordsByDate(userId, dateString)
      )
    );

    const result = dateStrings.map((date, index) => ({
      date: date,
      ...drivingSummaries[index],
    }));

    res.status(200).json(result);
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
