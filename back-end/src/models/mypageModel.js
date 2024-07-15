const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTotalIncome = async (userId, startDate, endDate) => {
  const result = await prisma.income_records.aggregate({
    _sum: {
      total_income: true,
    },
    where: {
      userId,
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return result._sum.total_income || 0;
};

const getTodayIncome = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const result = await prisma.income_records.aggregate({
    _sum: {
      total_income: true,
    },
    where: {
      userId,
      created_at: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });
  return result._sum.total_income || 0;
};

const getTotalMileage = async (userId, startDate, endDate) => {
  const vehicle = await prisma.user_vehicles.findUnique({
    where: { userId },
    select: { mileage: true },
  });
  return vehicle ? vehicle.mileage : 0;
};

const getTodayDrivingDistance = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const result = await prisma.driving_records.aggregate({
    _sum: {
      driving_distance: true,
    },
    where: {
      driving_logs: {
        userId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    },
  });
  return result._sum.driving_distance || 0;
};

const getTotalExpense = async (userId, startDate, endDate) => {
  const result = await prisma.expense_records.aggregate({
    _sum: {
      total_expense: true,
    },
    where: {
      userId,
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return result._sum.total_expense || 0;
};

const getTodayExpense = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const result = await prisma.expense_records.aggregate({
    _sum: {
      total_expense: true,
    },
    where: {
      userId,
      created_at: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });
  return result._sum.total_expense || 0;
};
const getExpenseRecordsByDateRange = async (userId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // 하루의 끝 시간으로 설정

  const result = await prisma.expense_records.aggregate({
    _sum: {
      fuel_expense: true,
      toll_fee: true,
      meal_expense: true,
      fine_expense: true,
      other_expense: true,
      expense_spare1: true,
      expense_spare2: true,
      expense_spare3: true,
      expense_spare4: true,
      total_expense: true,
    },
    where: {
      userId,
      created_at: {
        gte: start,
        lt: end,
      },
    },
  });

  return result._sum;
};

const getIncomeRecordsByDateRange = async (userId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // 하루의 끝 시간으로 설정

  const result = await prisma.income_records.aggregate({
    _sum: {
      card_income: true,
      cash_income: true,
      kakao_income: true,
      uber_income: true,
      onda_income: true,
      tada_income: true,
      other_income: true,
      income_spare1: true,
      income_spare2: true,
      income_spare3: true,
      income_spare4: true,
      total_income: true,
    },
    where: {
      userId,
      created_at: {
        gte: start,
        lt: end,
      },
    },
  });

  return result._sum;
};
// 혼합 차트
const getDrivingDistance = async (userId, startDate, endDate) => {
  const result = await prisma.driving_records.aggregate({
    _sum: {
      driving_distance: true,
    },
    where: {
      driving_logs: {
        userId,
        date: {
          gte: new Date(startDate),
          lt: new Date(endDate),
        },
      },
    },
  });
  return result._sum.driving_distance || 0;
};

const getWorkingHours = async (userId, startDate, endDate) => {
  const records = await prisma.driving_records.findMany({
    where: {
      driving_logs: {
        userId,
        date: {
          gte: new Date(startDate),
          lt: new Date(endDate),
        },
      },
    },
    select: {
      working_hours: true,
    },
  });

  // 시간 합산
  const totalWorkingHours = records.reduce((acc, record) => {
    const [hours, minutes, seconds] = record.working_hours
      .split(":")
      .map(Number);
    return acc + (hours + minutes / 60 + seconds / 3600);
  }, 0);

  return totalWorkingHours;
};

const getTotalIncomeForPeriod = async (userId, startDate, endDate) => {
  const result = await prisma.income_records.aggregate({
    _sum: {
      total_income: true,
    },
    where: {
      userId,
      created_at: {
        gte: new Date(startDate),
        lt: new Date(endDate),
      },
    },
  });
  return result._sum.total_income || 0;
};
module.exports = {
  getTotalIncome,
  getTodayIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
  getExpenseRecordsByDateRange,
  getIncomeRecordsByDateRange,
  // --------------
  getDrivingDistance,
  getWorkingHours,
  getTotalIncomeForPeriod,
};
