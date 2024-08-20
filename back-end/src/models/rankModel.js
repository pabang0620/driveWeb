const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllRankings() {
  return await prisma.ranking.findMany();
}

async function updateRankingModel(id, updateData) {
  //   console.log(updateData);
  try {
    const updatedRanking = await prisma.ranking.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    return updatedRanking;
  } catch (error) {
    throw new Error(`랭킹 업데이트 중 오류 발생: ${error.message}`);
  }
}

// -----------------------------------------------
// 총 순수익 랭킹
async function getTopNetIncomeUsers(filterType, filterValue) {
  let whereCondition = {};
  if (filterType && filterValue && filterValue !== "전체") {
    whereCondition[filterType] = filterValue;
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      nickname: true,
      income_records: {
        select: {
          total_income: true,
        },
      },
    },
  });

  const usersWithTotalIncome = users.map((user) => {
    const totalIncome = user.income_records.reduce(
      (acc, record) => acc + parseFloat(record.total_income || 0),
      0
    );

    // 10000 -> 10,000원 형식으로 변환
    const formattedIncome = totalIncome.toLocaleString("ko-KR") + "원";

    return {
      id: user.id,
      nickname: user.nickname,
      value: formattedIncome,
    };
  });

  // 상위 5명의 사용자를 총 수입이 높은 순으로 정렬
  usersWithTotalIncome.sort((a, b) => b.totalIncome - a.totalIncome);

  return usersWithTotalIncome.slice(0, 5);
}

// 운행 시간
const getTopUsersByDrivingTime = async (filterType, filterValue) => {
  try {
    let filterConditions = {};
    if (filterValue && filterValue !== "전체") {
      filterConditions[filterType] = parseInt(filterValue);
    }

    const users = await prisma.users.findMany({
      where: filterConditions,
      select: {
        id: true,
        nickname: true,
        driving_logs: {
          select: {
            driving_records: {
              select: {
                working_hours_seconds: true,
              },
            },
          },
        },
      },
    });

    const usersWithTotalDrivingTime = users.map((user) => {
      const totalDrivingTimeInSeconds = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + (record.working_hours_seconds || 0),
            0
          ),
        0
      );

      const totalDrivingTimeInHours = totalDrivingTimeInSeconds / 3600; // 초를 시간으로 변환

      return {
        id: user.id,
        nickname: user.nickname,
        value: `${totalDrivingTimeInHours.toFixed(1)} 시간`,
      };
    });

    // 총 운행 시간이 높은 순으로 정렬
    usersWithTotalDrivingTime.sort((a, b) => b.value - a.value);

    // 상위 5명 반환
    return usersWithTotalDrivingTime.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by driving time:", error);
    throw error;
  }
};

// 연비 랭킹
const getTopUsersByFuelEfficiency = async (filterType, filterValue) => {
  try {
    let whereCondition = {};
    if (filterType && filterValue && filterValue !== "전체") {
      whereCondition[filterType] = filterValue;
    }

    const users = await prisma.users.findMany({
      where: whereCondition,
      select: {
        id: true,
        nickname: true,
        driving_logs: {
          select: {
            driving_records: {
              select: {
                driving_distance: true, // 주행 거리 (km)
                fuel_amount: true, // 연료 소비량 (L)
              },
            },
          },
        },
      },
    });

    const usersWithFuelEfficiency = users.map((user) => {
      const totalDistance = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + (record.driving_distance || 0),
            0
          ),
        0
      );

      const totalFuel = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + (record.fuel_amount || 0),
            0
          ),
        0
      );

      const fuelEfficiency = totalFuel > 0 ? totalDistance / totalFuel : 0;

      // 연비를 소수점 두 자리로 표시하고 "km/L" 단위 추가
      const formattedFuelEfficiency = fuelEfficiency.toFixed(2) + " km/L";

      return {
        id: user.id,
        nickname: user.nickname,
        value: formattedFuelEfficiency,
      };
    });

    usersWithFuelEfficiency.sort((a, b) => b.value - a.value);
    return usersWithFuelEfficiency.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by fuel efficiency:", error);
    throw error;
  }
};

// 주행 거리 랭킹
async function getTopDrivingDistanceUsersModel(filterType, filterValue) {
  let whereCondition = {};
  if (filterType && filterValue && filterValue !== "전체") {
    whereCondition[filterType] = filterValue;
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      nickname: true,
      driving_records_aggregate: {
        _sum: {
          driving_distance: true,
        },
      },
    },
    orderBy: {
      driving_records_aggregate: {
        _sum: {
          driving_distance: "desc",
        },
      },
    },
    take: 5,
  });
  return users.map((user) => ({
    id: user.id,
    nickname: user.nickname,
    value: user.driving_records_aggregate._sum.driving_distance,
  }));
}

// 총 건수 랭킹
async function getTopTotalCasesUsersModel(filterType, filterValue) {
  let whereCondition = {};
  if (filterType && filterValue && filterValue !== "전체") {
    whereCondition[filterType] = filterValue;
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      nickname: true,
      driving_records_aggregate: {
        _sum: {
          total_driving_cases: true,
        },
      },
    },
    orderBy: {
      driving_records_aggregate: {
        _sum: {
          total_driving_cases: "desc",
        },
      },
    },
    take: 5,
  });
  return users.map((user) => ({
    id: user.id,
    nickname: user.nickname,
    value: user.driving_records_aggregate._sum.total_driving_cases,
  }));
}

// 순이익 랭킹
async function getTopProfitLossUsersModel(filterType, filterValue) {
  let whereCondition = {};

  if (filterType && filterValue && filterValue !== "전체") {
    whereCondition[filterType] = filterValue;
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      nickname: true,
      expense_records_aggregate: {
        _sum: {
          profit_loss: true,
        },
      },
    },
    orderBy: {
      expense_records_aggregate: {
        _sum: {
          profit_loss: "desc",
        },
      },
    },
    take: 5,
  });

  const usersWithFormattedProfitLoss = users.map((user) => {
    const profitLoss = user.expense_records_aggregate._sum.profit_loss || 0;

    // 10000 -> 10,000원 형식으로 변환
    const formattedProfitLoss = profitLoss.toLocaleString("ko-KR") + "원";

    return {
      id: user.id,
      nickname: user.nickname,
      value: formattedProfitLoss,
    };
  });

  return usersWithFormattedProfitLoss;
}

module.exports = {
  getAllRankings,
  updateRankingModel,
  //   ---------- 랭크
  getTopUsersByDrivingTime,
  getTopNetIncomeUsers,
  getTopUsersByFuelEfficiency,
  getTopDrivingDistanceUsersModel,
  getTopTotalCasesUsersModel,
  getTopProfitLossUsersModel,
};
