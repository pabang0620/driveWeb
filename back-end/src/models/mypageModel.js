const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTotalIncome = async (userId, startDate, endDate) => {
  console.log("getTotalIncome - Params:", { userId, startDate, endDate });
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
  console.log("getTotalIncome - Result:", result);
  return result._sum.total_income || 0;
};

const getTodayIncome = async (userId, date) => {
  console.log("getTodayIncome - Params:", { userId, date });
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
  console.log("getTodayIncome - Result:", result);
  return result._sum.total_income || 0;
};

const getTotalMileage = async (userId, startDate, endDate) => {
  console.log("getTotalMileage - Params:", { userId, startDate, endDate });
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
  console.log("getTotalMileage - Result:", result);
  return result._sum.driving_distance || 0;
};

const getTodayDrivingDistance = async (userId, date) => {
  console.log("getTodayDrivingDistance - Params:", { userId, date });
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
  console.log("getTodayDrivingDistance - Result:", result);
  return result._sum.driving_distance || 0;
};

const getTotalExpense = async (userId, startDate, endDate) => {
  console.log("getTotalExpense - Params:", { userId, startDate, endDate });
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
  console.log("getTotalExpense - Result:", result);
  return result._sum.total_expense || 0;
};

const getTodayExpense = async (userId, date) => {
  console.log("getTodayExpense - Params:", { userId, date });
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

const getDrivingRecordsByDateRange = async (userId, startDate, endDate) => {
  console.log("getDrivingRecordsByDateRange - Params:", {
    userId,
    startDate,
    endDate,
  });
  const result = await prisma.driving_records.aggregate({
    _sum: {
      driving_distance: true,
      totalDrivingTime: true,
      total_income: true, // 총 수입금 필드 추가
    },
    where: {
      driving_logs: {
        userId: userId, // Prisma 쿼리에서 userId 필드 사용
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });
  console.log("getDrivingRecordsByDateRange - Result:", result);
  return result._sum;
};

const getIncomeRecordsByDateRange = async (userId, startDate, endDate) => {
  console.log("getIncomeRecordsByDateRange - Params:", {
    userId,
    startDate,
    endDate,
  });
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
  console.log("getIncomeRecordsByDateRange - Result:", result);
  return result._sum;
};

const getExpenseRecordsByDateRange = async (userId, startDate, endDate) => {
  console.log("getExpenseRecordsByDateRange - Params:", {
    userId,
    startDate,
    endDate,
  });
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
  console.log("getExpenseRecordsByDateRange - Result:", result);
  return result._sum;
};

module.exports = {
  getTotalIncome,
  getTodayIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
  getDrivingRecordsByDateRange,
  getExpenseRecordsByDateRange,
  getIncomeRecordsByDateRange,
};
