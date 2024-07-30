const {
  getTotalIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
  getTodayIncome,
  getExpenseRecordsByDateRange,
  getIncomeRecordsByDateRange,
  getDrivingRecordsByDate,
  getAllUsersTotalExpense,
  getAllUsersTotalIncome,
  getAllUsersTotalMileage,
  getDrivingLogs,
  getDrivingRecords,
  getIncomeRecords,
  getExpenseRecords,
} = require("../models/mypageModel");

const calculatePercentage = (userValue, allValues) => {
  const sortedValues = allValues.sort((a, b) => a - b);
  const rank = sortedValues.findIndex((value) => value >= userValue) + 1;
  return (rank / sortedValues.length) * 100;
};

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMyPageData = async (req, res) => {
  try {
    const { userId } = req;
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const startDateString = formatDateToYYYYMMDD(start);
    const endDateString = formatDateToYYYYMMDD(end);

    const drivingLogs = await getDrivingLogs(startDateString, endDateString);
    const logIds = drivingLogs.map((log) => log.id);

    const drivingRecords = await getDrivingRecords(logIds);
    const incomeRecords = await getIncomeRecords(logIds);
    const expenseRecords = await getExpenseRecords(logIds);

    console.log("Driving Logs:", drivingLogs);
    console.log("Driving Records:", drivingRecords);
    console.log("Income Records:", incomeRecords);
    console.log("Expense Records:", expenseRecords);

    const userLogIds = drivingLogs
      .filter((log) => log.userId === userId)
      .map((log) => log.id);
    const userDrivingRecord = drivingRecords.find((record) =>
      userLogIds.includes(record.driving_log_id)
    );
    const userIncomeRecord = incomeRecords.find((record) =>
      userLogIds.includes(record.driving_log_id)
    );
    const userExpenseRecord = expenseRecords.find((record) =>
      userLogIds.includes(record.driving_log_id)
    );

    const totalMileage = userDrivingRecord
      ? userDrivingRecord._sum.driving_distance
      : 0;
    const totalIncome = userIncomeRecord
      ? userIncomeRecord._sum.total_income
      : 0;
    const totalExpense = userExpenseRecord
      ? userExpenseRecord._sum.total_expense
      : 0;
    const netProfit = totalIncome - totalExpense;

    const todayIncome = await getTodayIncome(userId, endDateString);
    const todayDrivingDistance = await getTodayDrivingDistance(
      userId,
      endDateString
    );
    const todayExpense = await getTodayExpense(userId, endDateString);
    const todayNetProfit = todayIncome - todayExpense;

    const allMileages = drivingRecords.map(
      (record) => record._sum.driving_distance || 0
    );
    const allIncomes = incomeRecords.map(
      (record) => record._sum.total_income || 0
    );
    const allExpenses = expenseRecords.map(
      (record) => record._sum.total_expense || 0
    );
    const allNetProfits = allIncomes.map(
      (income, index) => income - allExpenses[index]
    );

    console.log("All Mileages:", allMileages);
    console.log("All Incomes:", allIncomes);
    console.log("All Expenses:", allExpenses);
    console.log("All Net Profits:", allNetProfits);

    const totalMileagePercentage = calculatePercentage(
      totalMileage,
      allMileages
    );
    const totalIncomePercentage = calculatePercentage(totalIncome, allIncomes);
    const netProfitPercentage = calculatePercentage(netProfit, allNetProfits);

    res.status(200).json({
      totalIncome,
      todayIncome,
      totalMileage,
      todayDrivingDistance,
      netProfit,
      todayNetProfit,
      totalMileagePercentage,
      totalIncomePercentage,
      netProfitPercentage,
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
