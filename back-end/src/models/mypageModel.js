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

module.exports = {
  getTotalIncome,
  getTodayIncome,
  getTotalMileage,
  getTodayDrivingDistance,
  getTotalExpense,
  getTodayExpense,
};
