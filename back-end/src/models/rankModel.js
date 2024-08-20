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
    if (filterType === "jobType") {
      whereCondition = { jobtype: parseInt(filterValue) };
    } else if (filterType === "fuelType") {
      whereCondition = {
        user_vehicles: {
          some: {
            fuel_type: filterValue,
          },
        },
      };
    } else if (filterType === "carType") {
      whereCondition = {
        user_vehicles: {
          some: {
            carType: filterValue,
          },
        },
      };
    }
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    include: {
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
  usersWithTotalIncome.sort((a, b) => b.value - a.value);

  return usersWithTotalIncome.slice(0, 5);
}

// 운행 시간
const getTopUsersByDrivingTime = async (filterType, filterValue) => {
  try {
    let vehicleFilterCondition = {};

    // 필터 타입과 값에 따라 필터링 조건 설정
    if (filterType === "carType" && filterValue && filterValue !== "전체") {
      vehicleFilterCondition = {
        carType: filterValue,
      };
    }

    // 차량 정보를 필터링하여 사용자 ID를 추출
    const userVehicles = await prisma.user_vehicles.findMany({
      where: vehicleFilterCondition,
      select: {
        userId: true,
      },
    });

    // 필터링된 사용자 ID 목록
    const userIds = userVehicles.map((uv) => uv.userId);

    // 사용자 정보를 조회
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        driving_logs: {
          include: {
            driving_records: true,
          },
        },
      },
    });

    // 각 사용자의 총 운전 시간 계산
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
        value: totalDrivingTimeInHours, // 숫자 값으로 저장
        formattedValue: `${totalDrivingTimeInHours.toFixed(1)} 시간`, // 포맷된 값
      };
    });

    // 총 운행 시간이 높은 순서로 정렬
    usersWithTotalDrivingTime.sort((a, b) => b.value - a.value);

    // 상위 5명 반환 (포맷된 값을 사용하여 반환)
    return usersWithTotalDrivingTime.slice(0, 5).map((user) => ({
      id: user.id,
      nickname: user.nickname,
      value: user.formattedValue,
    }));
  } catch (error) {
    console.error("Error fetching top users by driving time:", error);
    throw error;
  }
};

// 연비 랭킹
const getTopUsersByFuelEfficiency = async (filterType, filterValue) => {
  try {
    let fuelTypeCondition = {};

    if (filterType === "fuelType" && filterValue && filterValue !== "전체") {
      fuelTypeCondition = {
        user_vehicles: {
          fuel_type: filterValue,
        },
      };
    } else if (
      filterType === "carType" &&
      filterValue &&
      filterValue !== "전체"
    ) {
      fuelTypeCondition = {
        user_vehicles: {
          carType: filterValue,
        },
      };
    } else if (
      filterType === "jobType" &&
      filterValue &&
      filterValue !== "전체"
    ) {
      fuelTypeCondition = {
        jobtype: parseInt(filterValue),
      };
    }

    // users와 관련된 driving_logs와 driving_records를 가져옴
    const users = await prisma.users.findMany({
      where: {
        ...fuelTypeCondition,
      },
      include: {
        driving_logs: {
          include: {
            driving_records: true,
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
      const formattedFuelEfficiency = `${fuelEfficiency.toFixed(2)} km/L`;

      return {
        id: user.id,
        nickname: user.nickname,
        value: formattedFuelEfficiency,
      };
    });

    usersWithFuelEfficiency.sort(
      (a, b) => parseFloat(b.value) - parseFloat(a.value)
    );
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
    if (filterType === "jobType") {
      whereCondition.jobtype = parseInt(filterValue);
    } else if (filterType === "fuelType") {
      whereCondition = {
        user_vehicles: {
          some: {
            fuel_type: filterValue,
          },
        },
      };
    } else if (filterType === "carType") {
      whereCondition = {
        user_vehicles: {
          some: {
            carType: filterValue,
          },
        },
      };
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

  return users.map((user) => {
    const formattedDistance = user.driving_records_aggregate._sum
      .driving_distance
      ? `${user.driving_records_aggregate._sum.driving_distance.toLocaleString()} km`
      : "0 km";

    return {
      id: user.id,
      nickname: user.nickname,
      value: formattedDistance,
    };
  });
}

// 총 건수 랭킹
async function getTopTotalCasesUsersModel(filterType, filterValue) {
  let whereCondition = {};

  if (filterType && filterValue && filterValue !== "전체") {
    if (filterType === "jobType") {
      whereCondition.jobtype = parseInt(filterValue);
    } else if (filterType === "fuelType") {
      whereCondition = {
        user_vehicles: {
          some: {
            fuel_type: filterValue,
          },
        },
      };
    } else if (filterType === "carType") {
      whereCondition = {
        user_vehicles: {
          some: {
            carType: filterValue,
          },
        },
      };
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

  return users.map((user) => {
    const totalCases =
      user.driving_records_aggregate._sum.total_driving_cases || 0;

    return {
      id: user.id,
      nickname: user.nickname,
      value: `${totalCases.toLocaleString()} 건`, // 숫자를 지역화된 형식으로 변환하고 "건" 단위 추가
    };
  });
}

// 순이익 랭킹
async function getTopProfitLossUsersModel(filterType, filterValue) {
  let whereCondition = {};

  // 필터 타입과 값이 주어졌을 경우 필터링 조건 추가
  if (filterType && filterValue && filterValue !== "전체") {
    if (filterType === "jobtype") {
      const jobTypeMap = {
        택시: 1,
        배달: 2,
        기타: 3,
      };

      const mappedValue = jobTypeMap[filterValue];
      if (mappedValue !== undefined) {
        whereCondition = {
          jobtype: mappedValue,
        };
      }
    } else if (filterType === "fuelType") {
      whereCondition = {
        user_vehicles: {
          some: {
            fuel_type: filterValue,
          },
        },
      };
    } else if (filterType === "carType") {
      whereCondition = {
        user_vehicles: {
          some: {
            carType: filterValue,
          },
        },
      };
    }
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      nickname: true,
      expense_records: {
        select: {
          profit_loss: true,
        },
      },
    },
  });

  // 각 사용자의 순이익 합산
  const usersWithTotalProfitLoss = users.map((user) => {
    const totalProfitLoss = user.expense_records.reduce((acc, record) => {
      const profitLossValue = parseFloat(record.profit_loss || 0);
      return acc + (isNaN(profitLossValue) ? 0 : profitLossValue);
    }, 0);

    // 10000 -> 10,000원 형식으로 변환
    const formattedProfitLoss = totalProfitLoss.toLocaleString("ko-KR") + "원";

    return {
      id: user.id,
      nickname: user.nickname,
      value: formattedProfitLoss,
      totalProfitLoss, // 정렬을 위해 원래 값도 유지
    };
  });

  // 총 순이익으로 정렬
  usersWithTotalProfitLoss.sort(
    (a, b) => b.totalProfitLoss - a.totalProfitLoss
  );

  // 상위 5명 반환
  return usersWithTotalProfitLoss
    .slice(0, 5)
    .map(({ id, nickname, value }) => ({
      id,
      nickname,
      value,
    }));
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
