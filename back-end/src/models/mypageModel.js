const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// 상단
const getTotalIncome = async (userId, startDate, endDate) => {
  // console.log("getTotalIncome - Params:", { userId, startDate, endDate });
  const result = await prisma.income_records.aggregate({
    _sum: {
      total_income: true,
    },
    where: {
      userId,
      driving_logs: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });
  // console.log("getTotalIncome - Result:", result);
  return result._sum.total_income || 0;
};

const getTodayIncome = async (userId, date) => {
  // console.log("getTodayIncome - Params:", { userId, date });
  const result = await prisma.income_records.aggregate({
    _sum: {
      total_income: true,
    },
    where: {
      userId,
      driving_logs: {
        date: date,
      },
    },
  });
  // console.log("getTodayIncome - Result:", result);
  return result._sum.total_income || 0;
};

const getTotalMileage = async (userId, startDate, endDate) => {
  // console.log("getTotalMileage - Params:", { userId, startDate, endDate });
  const result = await prisma.driving_records.aggregate({
    _sum: {
      driving_distance: true,
    },
    where: {
      driving_logs: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });
  // console.log("getTotalMileage - Result:", result);
  return result._sum.driving_distance || 0;
};

const getTodayDrivingDistance = async (userId, date) => {
  // console.log("getTodayDrivingDistance - Params:", { userId, date });
  const result = await prisma.driving_records.aggregate({
    _sum: {
      driving_distance: true,
    },
    where: {
      driving_logs: {
        userId: userId,
        date: date,
      },
    },
  });
  // console.log("getTodayDrivingDistance - Result:", result);
  return result._sum.driving_distance || 0;
};

const getTotalExpense = async (userId, startDate, endDate) => {
  // console.log("getTotalExpense - Params:", { userId, startDate, endDate });
  const result = await prisma.expense_records.aggregate({
    _sum: {
      total_expense: true,
    },
    where: {
      userId,
      driving_logs: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });
  // console.log("getTotalExpense - Result:", result);
  return result._sum.total_expense || 0;
};

const getTodayExpense = async (userId, date) => {
  // console.log("getTodayExpense - Params:", { userId, date });
  const result = await prisma.expense_records.aggregate({
    _sum: {
      total_expense: true,
    },
    where: {
      userId,
      driving_logs: {
        date: date,
      },
    },
  });
  console.log("getTodayExpense - Result:", result);
  return result._sum.total_expense || 0;
};

// 순위

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
      driving_distance: true,
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
      total_income: true,
    },
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
  });
};

const getExpenseRecords = async (logIds) => {
  return await prisma.expense_records.groupBy({
    by: ["driving_log_id"],
    _sum: {
      total_expense: true,
    },
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
  });
};
// 수입
const getIncomeRecordsByDateRange = async (userId, startDate, endDate) => {
  // console.log("getIncomeRecordsByDateRange - Params:", {
  //   userId,
  //   startDate,
  //   endDate,
  // });
  const result = await prisma.income_records.aggregate({
    _sum: {
      card_income: true,
      cash_income: true,
      kakao_income: true,
      uber_income: true,
      onda_income: true,
      tada_income: true,
      other_income: true,
      income_spare_1: true,
      income_spare_2: true,
      income_spare_3: true,
      income_spare_4: true,
      total_income: true,
    },
    where: {
      userId,
      driving_logs: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });
  // console.log("getIncomeRecordsByDateRange - Result:", result);
  return result._sum;
};
// 지출
const getExpenseRecordsByDateRange = async (userId, startDate, endDate) => {
  // console.log("getExpenseRecordsByDateRange - Params:", {
  //   userId,
  //   startDate,
  //   endDate,
  // });
  const result = await prisma.expense_records.aggregate({
    _sum: {
      fuel_expense: true,
      toll_fee: true,
      meal_expense: true,
      fine_expense: true,
      other_expense: true,
      expense_spare_1: true,
      expense_spare_2: true,
      expense_spare_3: true,
      expense_spare_4: true,
      total_expense: true,
      kakao_fee: true,
      tada_fee: true,
      onda_fee: true,
      uber_fee: true,
      iam_fee: true,
      card_fee: true,
      etc_fee: true,
    },
    where: {
      userId,
      driving_logs: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });
  // console.log("getExpenseRecordsByDateRange - Result:", result);
  return result._sum;
};
// 혼합 차트
const getDrivingRecordsByDate = async (userId, dateString) => {
  const records = await prisma.driving_logs.findMany({
    where: {
      userId: userId,
      date: dateString,
    },
    include: {
      driving_records: true,
      income_records: true,
    },
  });

  const summary = records.reduce(
    (acc, record) => {
      record.driving_records.forEach((drivingRecord) => {
        if (drivingRecord.working_hours) {
          const hours = drivingRecord.working_hours
            .getUTCHours()
            .toString()
            .padStart(2, "0");
          const minutes = drivingRecord.working_hours
            .getUTCMinutes()
            .toString()
            .padStart(2, "0");
          const seconds = drivingRecord.working_hours
            .getUTCSeconds()
            .toString()
            .padStart(2, "0");
          acc.working_hours = `${hours}:${minutes}:${seconds}`;
        }
        acc.driving_distance += drivingRecord.driving_distance || 0;
      });

      record.income_records.forEach((incomeRecord) => {
        acc.total_income += Number(incomeRecord.total_income) || 0;
      });

      return acc;
    },
    { working_hours: "00:00:00", driving_distance: 0, total_income: 0 }
  );

  return summary;
};

module.exports = {
  getTotalIncome,
  getTodayIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
  // 순위
  getDrivingLogs,
  getDrivingRecords,
  getIncomeRecords,
  getExpenseRecords,
  // 차트
  getExpenseRecordsByDateRange,
  getIncomeRecordsByDateRange,
  getDrivingRecordsByDate,
};
