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
  getDrivingLogs,
  getDrivingRecords,
  getIncomeRecords,
  getExpenseRecords,
  getTotalDrivingTime,
  getTodayDrivingTime,
  getAllUsersAggregatedData,
} = require("../models/mypageModel");

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMyPageData = async (req, res) => {
  try {
    const { userId } = req; // 로그인된 사용자의 ID를 가져옴

    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD 형식)

    // 1. 오늘의 데이터 가져오기
    const todayIncome = await getTodayIncome(userId, today);
    const todayExpense = await getTodayExpense(userId, today);
    const todayDrivingDistance = await getTodayDrivingDistance(userId, today);
    const todayDrivingTime = await getTodayDrivingTime(userId, today);
    const todayNetProfit = todayIncome - todayExpense; // 오늘의 수익금 계산

    // 2. 전체 데이터 가져오기 (총 수입, 지출, 주행거리, 운행시간, 수익금)
    const totalIncome = await getTotalIncome(userId);
    const totalExpense = await getTotalExpense(userId);
    const totalMileage = await getTotalMileage(userId);
    const totalDrivingTime = await getTotalDrivingTime(userId);
    const totalNetProfit = totalIncome - totalExpense; // 총 수익금 계산

    // 3. 전체 사용자 데이터 가져오기
    const { incomeRecords, expenseRecords, drivingRecords } =
      await getAllUsersAggregatedData();

    // 전체 유저 데이터에서 각 항목별 리스트 생성
    const allIncomes = incomeRecords.map(
      (record) => Math.floor(record._sum.total_income || 0) // 소숫점 제거
    );

    const allExpenses = expenseRecords.map(
      (record) => Math.floor(record._sum.total_expense || 0) // 소숫점 제거
    );

    const allDrivingDistances = drivingRecords.map(
      (record) => record._sum.driving_distance || 0
    );
    const allDrivingTimes = drivingRecords.map(
      (record) => record._sum.working_hours_seconds || 0
    );

    // 손익 계산
    const netProfits = incomeRecords.map((income, index) => {
      const expense = expenseRecords[index]?._sum?.total_expense || 0;
      return income._sum.total_income - expense;
    });

    // 4. 상위 퍼센트 계산
    const calculatePercentage = (value, allValues) => {
      allValues.sort((a, b) => a - b); // 오름차순 정렬
      const position = allValues.indexOf(value) + 1; // 현재 유저의 위치
      return ((position / allValues.length) * 100).toFixed(2); // 상위 퍼센트 계산
    };

    // 사용자 퍼센트 계산
    const totalIncomePercent = calculatePercentage(totalIncome, allIncomes);
    const totalExpensePercent = calculatePercentage(totalExpense, allExpenses);
    const totalMileagePercent = calculatePercentage(
      totalMileage,
      allDrivingDistances
    );
    const totalDrivingTimePercent = calculatePercentage(
      totalDrivingTime * 3600,
      allDrivingTimes
    ); // 시간 -> 초 단위로 변환해서 비교
    const totalNetProfitPercent = calculatePercentage(
      totalNetProfit,
      netProfits
    );

    // 5. 결과를 응답으로 전송
    res.status(200).json({
      today: {
        income: todayIncome,
        expense: todayExpense,
        drivingDistance: todayDrivingDistance,
        drivingTime: todayDrivingTime,
        netProfit: todayNetProfit,
      },
      total: {
        income: totalIncome,
        expense: totalExpense,
        mileage: totalMileage,
        drivingTime: totalDrivingTime, // 초 단위가 아닌 시간 단위로 전달
        netProfit: totalNetProfit,
        incomePercent: totalIncomePercent,
        expensePercent: totalExpensePercent,
        mileagePercent: totalMileagePercent,
        drivingTimePercent: totalDrivingTimePercent,
        netProfitPercent: totalNetProfitPercent,
      },
    });
  } catch (error) {
    console.error("Error in getMyPageData:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
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
