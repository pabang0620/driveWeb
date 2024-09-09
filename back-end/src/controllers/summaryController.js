const {
  getDrivingLogs,
  getDrivingRecords,
  getIncomeRecords,
  getTodayDrivingRecords,
  getTodayIncomeRecords,
} = require("../models/summaryModel");

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatSecondsToHHMMSS = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

const calculatePercentage = (userValue, allValues) => {
  // allValues 배열을 숫자로 변환하고 오름차순 정렬
  const numericValues = allValues.map(Number).sort((a, b) => a - b);

  // userValue가 allValues에서 몇 번째에 위치하는지 확인 (순위 계산)
  const rank = numericValues.findIndex((value) => userValue <= value) + 1;

  // 전체 데이터에서 순위를 퍼센트로 변환 (상위 퍼센트 계산)
  return ((numericValues.length - rank) / numericValues.length) * 100;
};

const getSummaryData = async (req, res) => {
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

    // 주어진 기간 내의 모든 운전 로그 가져오기
    const drivingLogs = await getDrivingLogs(startDateString, endDateString);

    // 사용자별로 그룹화하여 운전 기록을 관리
    const userRecordsMap = new Map();

    drivingLogs.forEach((log) => {
      if (!userRecordsMap.has(log.userId)) {
        userRecordsMap.set(log.userId, {
          drivingRecords: [],
          incomeRecords: [],
        });
      }
    });

    // 로그 아이디들로 운전 기록 및 수입 기록을 가져와서 사용자별로 분배
    const logIds = drivingLogs.map((log) => log.id);
    const drivingRecords = await getDrivingRecords(logIds);
    const incomeRecords = await getIncomeRecords(logIds);

    drivingLogs.forEach((log) => {
      const userRecords = userRecordsMap.get(log.userId);
      userRecords.drivingRecords.push(
        ...drivingRecords.filter((record) => record.driving_log_id === log.id)
      );
      userRecords.incomeRecords.push(
        ...incomeRecords.filter((record) => record.driving_log_id === log.id)
      );
    });

    // 각 사용자의 데이터를 합산하여 계산
    const userSums = [];

    userRecordsMap.forEach((records, userId) => {
      const totalWorkingHours = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.working_hours_seconds) || 0),
        0
      );
      const totalDrivingDistance = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.driving_distance) || 0),
        0
      );
      const totalBusinessDistance = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.business_distance) || 0),
        0
      );
      const totalBusinessRate = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.business_rate) || 0),
        0
      );
      const totalFuelAmount = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.fuel_amount) || 0),
        0
      );
      const totalFuelEfficiency = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.fuel_efficiency) || 0),
        0
      );
      const totalDrivingCases = records.drivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.total_driving_cases) || 0),
        0
      );
      const totalIncomePerHour = records.incomeRecords.reduce(
        (acc, record) => acc + (Number(record._sum.income_per_hour) || 0),
        0
      );
      const totalIncomePerKm = records.incomeRecords.reduce(
        (acc, record) => acc + (Number(record._sum.income_per_km) || 0),
        0
      );

      // 사용자별 데이터 저장
      userSums.push({
        userId,
        totalWorkingHours,
        totalDrivingDistance,
        totalBusinessDistance,
        totalBusinessRate,
        totalFuelAmount,
        totalFuelEfficiency,
        totalDrivingCases,
        totalIncomePerHour,
        totalIncomePerKm,
      });
    });

    // 각 사용자의 값을 기준으로 순위를 매기고 상위 몇 퍼센트인지 계산
    const calculateRankPercentage = (userValue, allValues) => {
      // 모든 값을 숫자로 변환하고 정렬
      const sortedValues = allValues.slice().sort((a, b) => b - a);
      const rank = sortedValues.indexOf(userValue) + 1;
      return (rank / allValues.length) * 100; // 상위 몇 퍼센트인지 계산
    };

    // 해당 userId의 사용자만 처리
    const currentUser = userSums.find((user) => user.userId === Number(userId));
    if (!currentUser) {
      return res
        .status(404)
        .json({ error: "User data not found for the given period" });
    }

    // 각 사용자별로 전체 사용자들과 비교하여 퍼센트 계산
    const allWorkingHours = userSums.map((user) => user.totalWorkingHours);
    const allDrivingDistances = userSums.map(
      (user) => user.totalDrivingDistance
    );
    const allBusinessDistances = userSums.map(
      (user) => user.totalBusinessDistance
    );
    const allBusinessRates = userSums.map((user) => user.totalBusinessRate);
    const allFuelAmounts = userSums.map((user) => user.totalFuelAmount);
    const allFuelEfficiencies = userSums.map(
      (user) => user.totalFuelEfficiency
    );
    const allDrivingCases = userSums.map((user) => user.totalDrivingCases);
    const allIncomePerHours = userSums.map((user) => user.totalIncomePerHour);
    const allIncomePerKms = userSums.map((user) => user.totalIncomePerKm);

    const finalResult = {
      userId: currentUser.userId,
      totalWorkingHours: currentUser.totalWorkingHours,
      totalDrivingDistance: currentUser.totalDrivingDistance,
      totalBusinessDistance: currentUser.totalBusinessDistance,
      totalBusinessRate: currentUser.totalBusinessRate,
      totalFuelAmount: currentUser.totalFuelAmount,
      totalFuelEfficiency: currentUser.totalFuelEfficiency,
      totalDrivingCases: currentUser.totalDrivingCases,
      totalIncomePerHour: currentUser.totalIncomePerHour,
      totalIncomePerKm: currentUser.totalIncomePerKm,
      workingHoursPercentage: calculateRankPercentage(
        currentUser.totalWorkingHours,
        allWorkingHours
      ),
      drivingDistancePercentage: calculateRankPercentage(
        currentUser.totalDrivingDistance,
        allDrivingDistances
      ),
      businessDistancePercentage: calculateRankPercentage(
        currentUser.totalBusinessDistance,
        allBusinessDistances
      ),
      businessRatePercentage: calculateRankPercentage(
        currentUser.totalBusinessRate,
        allBusinessRates
      ),
      fuelAmountPercentage: calculateRankPercentage(
        currentUser.totalFuelAmount,
        allFuelAmounts
      ),
      fuelEfficiencyPercentage: calculateRankPercentage(
        currentUser.totalFuelEfficiency,
        allFuelEfficiencies
      ),
      drivingCasesPercentage: calculateRankPercentage(
        currentUser.totalDrivingCases,
        allDrivingCases
      ),
      incomePerHourPercentage: calculateRankPercentage(
        currentUser.totalIncomePerHour,
        allIncomePerHours
      ),
      incomePerKmPercentage: calculateRankPercentage(
        currentUser.totalIncomePerKm,
        allIncomePerKms
      ),
    };

    // 요청한 사용자에 대한 데이터만 반환
    res.status(200).json(finalResult);
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ error: "Error fetching summary data" });
  }
};

module.exports = {
  getSummaryData,
};
