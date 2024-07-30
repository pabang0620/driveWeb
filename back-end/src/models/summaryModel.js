const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getDrivingLogs = async (startDate, endDate) => {
  return await prisma.driving_logs.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });
};

const getDrivingRecords = async (logIds) => {
  return await prisma.driving_records.groupBy({
    by: ["driving_log_id"],
    _sum: {
      working_hours_seconds: true,
      driving_distance: true,
      business_distance: true,
      business_rate: true,
      fuel_amount: true,
      fuel_efficiency: true,
      total_driving_cases: true,
    },
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
  });
};

const getIncomeRecords = async (logIds) => {
  return await prisma.income_records.groupBy({
    by: ["driving_log_id"],
    _sum: {
      income_per_hour: true,
      income_per_km: true,
    },
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
  });
};

const getTodayDrivingRecords = async (userId, date) => {
  const logs = await prisma.driving_logs.findMany({
    where: {
      userId,
      date: date,
    },
    select: {
      id: true,
    },
  });

  const logIds = logs.map((log) => log.id);

  return await prisma.driving_records.groupBy({
    by: ["driving_log_id"],
    _sum: {
      working_hours_seconds: true,
      driving_distance: true,
      business_distance: true,
      business_rate: true,
      fuel_amount: true,
      fuel_efficiency: true,
      total_driving_cases: true,
    },
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
  });
};

const getTodayIncomeRecords = async (userId, date) => {
  const logs = await prisma.driving_logs.findMany({
    where: {
      userId,
      date: date,
    },
    select: {
      id: true,
    },
  });

  const logIds = logs.map((log) => log.id);

  return await prisma.income_records.groupBy({
    by: ["driving_log_id"],
    _sum: {
      income_per_hour: true,
      income_per_km: true,
    },
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
  });
};

module.exports = {
  getDrivingLogs,
  getDrivingRecords,
  getIncomeRecords,
  getTodayDrivingRecords,
  getTodayIncomeRecords,
};
