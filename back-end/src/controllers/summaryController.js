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
  const numericValues = allValues.map(Number).sort((a, b) => a - b);
  const rank = numericValues.findIndex((value) => userValue <= value) + 1;
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

    const drivingLogs = await getDrivingLogs(startDateString, endDateString);
    const logIds = drivingLogs.map((log) => log.id);

    const drivingRecords = await getDrivingRecords(logIds);
    const incomeRecords = await getIncomeRecords(logIds);

    console.log("Driving Logs:", drivingLogs);
    console.log("Driving Records:", drivingRecords);
    console.log("Income Records:", incomeRecords);

    const userLogIds = drivingLogs
      .filter((log) => log.userId === userId)
      .map((log) => log.id);
    const userDrivingRecords = drivingRecords.filter((record) =>
      userLogIds.includes(record.driving_log_id)
    );
    const userIncomeRecords = incomeRecords.filter((record) =>
      userLogIds.includes(record.driving_log_id)
    );

    const totalWorkingHours = formatSecondsToHHMMSS(
      userDrivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.working_hours_seconds) || 0),
        0
      )
    );
    const totalDrivingDistance = userDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.driving_distance) || 0),
      0
    );
    const totalBusinessDistance = userDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.business_distance) || 0),
      0
    );
    const totalBusinessRate = userDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.business_rate) || 0),
      0
    );
    const totalFuelAmount = userDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.fuel_amount) || 0),
      0
    );
    const totalFuelEfficiency = userDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.fuel_efficiency) || 0),
      0
    );
    const totalDrivingCases = userDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.total_driving_cases) || 0),
      0
    );

    const totalIncomePerHour = userIncomeRecords.reduce(
      (acc, record) => acc + (Number(record._sum.income_per_hour) || 0),
      0
    );
    const totalIncomePerKm = userIncomeRecords.reduce(
      (acc, record) => acc + (Number(record._sum.income_per_km) || 0),
      0
    );

    const todayDrivingRecords =
      (await getTodayDrivingRecords(userId, endDateString)) || [];
    const todayIncomeRecords =
      (await getTodayIncomeRecords(userId, endDateString)) || [];

    if (!Array.isArray(todayDrivingRecords)) {
      console.error(
        "todayDrivingRecords is not an array:",
        todayDrivingRecords
      );
      throw new TypeError("todayDrivingRecords is not an array");
    }

    if (!Array.isArray(todayIncomeRecords)) {
      console.error("todayIncomeRecords is not an array:", todayIncomeRecords);
      throw new TypeError("todayIncomeRecords is not an array");
    }

    const todayWorkingHours = formatSecondsToHHMMSS(
      todayDrivingRecords.reduce(
        (acc, record) => acc + (Number(record._sum.working_hours_seconds) || 0),
        0
      )
    );
    const todayDrivingDistance = todayDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.driving_distance) || 0),
      0
    );
    const todayBusinessDistance = todayDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.business_distance) || 0),
      0
    );
    const todayBusinessRate = todayDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.business_rate) || 0),
      0
    );
    const todayFuelAmount = todayDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.fuel_amount) || 0),
      0
    );
    const todayFuelEfficiency = todayDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.fuel_efficiency) || 0),
      0
    );
    const todayDrivingCases = todayDrivingRecords.reduce(
      (acc, record) => acc + (Number(record._sum.total_driving_cases) || 0),
      0
    );

    const todayIncomePerHour = todayIncomeRecords.reduce(
      (acc, record) => acc + (Number(record._sum.income_per_hour) || 0),
      0
    );
    const todayIncomePerKm = todayIncomeRecords.reduce(
      (acc, record) => acc + (Number(record._sum.income_per_km) || 0),
      0
    );

    const allWorkingHours = drivingRecords.map(
      (record) => Number(record._sum.working_hours_seconds) || 0
    );
    const allDrivingDistances = drivingRecords.map(
      (record) => Number(record._sum.driving_distance) || 0
    );
    const allBusinessDistances = drivingRecords.map(
      (record) => Number(record._sum.business_distance) || 0
    );
    const allBusinessRates = drivingRecords.map(
      (record) => Number(record._sum.business_rate) || 0
    );
    const allFuelAmounts = drivingRecords.map(
      (record) => Number(record._sum.fuel_amount) || 0
    );
    const allFuelEfficiencies = drivingRecords.map(
      (record) => Number(record._sum.fuel_efficiency) || 0
    );
    const allDrivingCases = drivingRecords.map(
      (record) => Number(record._sum.total_driving_cases) || 0
    );
    const allIncomePerHours = incomeRecords.map(
      (record) => Number(record._sum.income_per_hour) || 0
    );
    const allIncomePerKms = incomeRecords.map(
      (record) => Number(record._sum.income_per_km) || 0
    );

    const workingHoursPercentage = calculatePercentage(
      totalWorkingHours,
      allWorkingHours
    );
    const drivingDistancePercentage = calculatePercentage(
      totalDrivingDistance,
      allDrivingDistances
    );
    const businessDistancePercentage = calculatePercentage(
      totalBusinessDistance,
      allBusinessDistances
    );
    const businessRatePercentage = calculatePercentage(
      totalBusinessRate,
      allBusinessRates
    );
    const fuelAmountPercentage = calculatePercentage(
      totalFuelAmount,
      allFuelAmounts
    );
    const fuelEfficiencyPercentage = calculatePercentage(
      totalFuelEfficiency,
      allFuelEfficiencies
    );
    const drivingCasesPercentage = calculatePercentage(
      totalDrivingCases,
      allDrivingCases
    );
    const incomePerHourPercentage = calculatePercentage(
      totalIncomePerHour,
      allIncomePerHours
    );
    const incomePerKmPercentage = calculatePercentage(
      totalIncomePerKm,
      allIncomePerKms
    );

    res.status(200).json({
      totalWorkingHours,
      todayWorkingHours,
      totalDrivingDistance,
      todayDrivingDistance,
      totalBusinessDistance,
      todayBusinessDistance,
      totalBusinessRate,
      todayBusinessRate,
      totalFuelAmount,
      todayFuelAmount,
      totalFuelEfficiency,
      todayFuelEfficiency,
      totalDrivingCases,
      todayDrivingCases,
      totalIncomePerHour,
      todayIncomePerHour,
      totalIncomePerKm,
      todayIncomePerKm,
      workingHoursPercentage,
      drivingDistancePercentage,
      businessDistancePercentage,
      businessRatePercentage,
      fuelAmountPercentage,
      fuelEfficiencyPercentage,
      drivingCasesPercentage,
      incomePerHourPercentage,
      incomePerKmPercentage,
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ error: "Error fetching summary data" });
  }
};

module.exports = {
  getSummaryData,
};
