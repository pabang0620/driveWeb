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
// 순이익
const getTopUsersByDrivingTime = async (filterType, filterValue) => {
  try {
    let filterConditions = {};
    if (filterValue) {
      // 필터 값이 있을 경우에만 조건 적용

      switch (filterType) {
        case "jobtype": // Assuming 'jobtype' corresponds to a job type in the users table
          filterConditions = {
            jobtype: parseInt(filterValue), // Convert filterValue to integer if necessary
          };
          break;
        case "fuelType": // Assuming this corresponds to fuel type in a related vehicle table
          filterConditions = {
            user_vehicles: {
              some: {
                fuel_type: filterValue,
              },
            },
          };
          break;
        case "carType": // Assuming this corresponds to car type in a related vehicle table
          filterConditions = {
            user_vehicles: {
              some: {
                carType: filterValue,
              },
            },
          };
          break;
        default:
          throw new Error("Unsupported filter type");
      }
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
                working_hours: true,
              },
            },
          },
        },
      },
    });

    const usersWithTotalDrivingTime = users.map((user) => {
      const totalDrivingTime = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + record.working_hours.getHours(),
            0
          ),
        0
      );

      return {
        id: user.id,
        nickname: user.nickname,
        totalDrivingTime,
      };
    });

    usersWithTotalDrivingTime.sort(
      (a, b) => b.totalDrivingTime - a.totalDrivingTime
    );
    return usersWithTotalDrivingTime.slice(0, 5);
  } catch (error) {
    console.error(
      "Error fetching top users by driving time with filters:",
      error
    );
    throw error;
  }
};
// 총 운송
const getTopUsersByNetIncome = async (filterType, filterValue) => {
  try {
    let whereCondition = {};
    console.log(filterType, filterValue);
    if (filterValue) {
      // 필터 값이 있을 경우에만 조건 적용
      switch (filterType) {
        case "carType":
          if (filterValue !== "전체") {
            whereCondition = {
              user_vehicles: {
                some: {
                  carType: filterValue,
                },
              },
            };
          }
          break;
        case "fuelType":
          if (filterValue !== "전체") {
            whereCondition = {
              user_vehicles: {
                some: {
                  fuel_type: filterValue,
                },
              },
            };
          }
          break;
        case "jobType":
          whereCondition = {
            jobtype: parseInt(filterValue), // Assuming jobtype is stored as an integer
          };
          break;
        default:
          throw new Error("Unsupported filter type");
      }
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
        expense_records: {
          select: {
            total_expense: true,
          },
        },
      },
    });

    const usersWithNetIncome = users.map((user) => {
      const totalIncome = user.income_records.reduce(
        (acc, record) => acc + parseFloat(record.total_income || 0),
        0
      );
      const totalExpense = user.expense_records.reduce(
        (acc, record) => acc + parseFloat(record.total_expense || 0),
        0
      );
      const netIncome = totalIncome - totalExpense;

      return {
        id: user.id,
        nickname: user.nickname,
        netIncome,
      };
    });

    usersWithNetIncome.sort((a, b) => b.netIncome - a.netIncome);
    return usersWithNetIncome.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by net income:", error);
    throw error;
  }
};
// 연비
const getTopUsersByFuelEfficiency = async (filterType, filterValue) => {
  try {
    let whereCondition = {};
    if (filterValue) {
      // 필터 값이 있을 경우에만 조건 적용
      switch (filterType) {
        case "fuelType": // Direct filtering by fuel type if it's specifically fuelType
          whereCondition = {
            user_vehicles: {
              some: {
                fuel_type: filterValue,
              },
            },
          };
          break;
        case "carType": // Filtering by car type
          whereCondition = {
            user_vehicles: {
              some: {
                carType: filterValue,
              },
            },
          };
          break;
        case "jobType": // Filtering by job type, though less common in fuel efficiency
          whereCondition = {
            jobtype: parseInt(filterValue),
          };
          break;
        default:
          throw new Error("Unsupported filter type");
      }
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
                driving_distance: true,
                fuel_amount: true,
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
            (logAcc, record) => logAcc + record.driving_distance,
            0
          ),
        0
      );
      const totalFuel = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + record.fuel_amount,
            0
          ),
        0
      );

      const fuelEfficiency = totalFuel > 0 ? totalDistance / totalFuel : 0;

      return {
        id: user.id,
        nickname: user.nickname,
        fuelEfficiency: parseFloat(fuelEfficiency.toFixed(2)),
      };
    });

    usersWithFuelEfficiency.sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);
    return usersWithFuelEfficiency.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by fuel efficiency:", error);
    throw error;
  }
};

// 주행 거리 랭킹
async function getTopDrivingDistanceUsersModel(filterType, filterValue) {
  let whereCondition = {};

  if (filterType && filterValue) {
    switch (filterType) {
      case "jobType":
        whereCondition["jobtype"] = parseInt(filterValue);
        break;
      case "fuelType":
        whereCondition["user_vehicles"] = { some: { fuel_type: filterValue } };
        break;
      case "carType":
        whereCondition["user_vehicles"] = { some: { carType: filterValue } };
        break;
    }
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
  return users;
}

// 총 건수 랭킹
async function getTopTotalCasesUsersModel(filterType, filterValue) {
  let whereCondition = {};

  if (filterType && filterValue) {
    switch (filterType) {
      case "jobType":
        whereCondition["jobtype"] = parseInt(filterValue);
        break;
      case "fuelType":
        whereCondition["user_vehicles"] = { some: { fuel_type: filterValue } };
        break;
      case "carType":
        whereCondition["user_vehicles"] = { some: { carType: filterValue } };
        break;
    }
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
  return users;
}

// 순이익 랭킹
async function getTopProfitLossUsersModel(filterType, filterValue) {
  let whereCondition = {};

  if (filterType && filterValue) {
    switch (filterType) {
      case "jobType":
        whereCondition["jobtype"] = parseInt(filterValue);
        break;
      case "fuelType":
        whereCondition["user_vehicles"] = { some: { fuel_type: filterValue } };
        break;
      case "carType":
        whereCondition["user_vehicles"] = { some: { carType: filterValue } };
        break;
    }
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
  return users;
}

module.exports = {
  getAllRankings,
  updateRankingModel,
  //   ---------- 랭크
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
  getTopDrivingDistanceUsersModel,
  getTopTotalCasesUsersModel,
  getTopProfitLossUsersModel,
};
