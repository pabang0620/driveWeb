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
const getTopNetIncomeUsers = async (filterType, filterValue, selectedMonth) => {
  try {
    let vehicleFilterCondition = {};
    // console.log("Filter Type:", filterType);
    // console.log("Filter Value:", filterValue);
    // console.log("Selected Month (raw):", selectedMonth);

    // 필터 타입과 값에 따라 필터링 조건 설정
    if (filterType === "carType" && filterValue && filterValue !== "전체") {
      vehicleFilterCondition = {
        carType: filterValue,
      };
    } else if (filterType === "jobtype") {
      const jobTypeMap = {
        택시: 1,
        배달: 2,
        기타: 3,
      };

      const mappedValue = jobTypeMap[filterValue];
      if (mappedValue !== undefined) {
        vehicleFilterCondition = {
          jobtype: mappedValue,
        };
      }
    }

    // 특정 월에 해당하는 vehicle 조건 추가
    if (selectedMonth) {
      const month = parseInt(selectedMonth, 10); // selectedMonth를 정수로 변환
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 0);
      vehicleFilterCondition.created_at = {
        gte: startDate,
        lt: endDate,
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

    // 사용자와 관련된 수입 정보를 조회 (닉네임과 프로필 이미지 URL 포함)
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        user_profiles: {
          select: {
            imageUrl: true,
          },
        },
        income_records: {
          select: {
            total_income: true,
          },
        },
      },
    });

    // 각 사용자의 총 수입 계산
    const usersWithTotalIncome = users.map((user) => {
      const totalIncome = user.income_records.reduce(
        (acc, record) => acc + parseFloat(record.total_income || 0),
        0
      );

      const formattedIncome = totalIncome.toLocaleString("ko-KR") + "원";

      return {
        id: user.id,
        nickname: user.nickname,
        imageUrl: user.user_profiles?.imageUrl || null, // 프로필 이미지 URL 추가
        value: formattedIncome,
        income: totalIncome, // 정렬을 위해 원래 값도 유지
      };
    });

    // 총 수입이 높은 순서로 정렬
    usersWithTotalIncome.sort((a, b) => b.income - a.income);

    // 상위 5명 반환 (포맷된 값을 사용하여 반환)
    return usersWithTotalIncome.slice(0, 5).map((user) => ({
      id: user.id,
      nickname: user.nickname,
      imageUrl: user.imageUrl, // 프로필 이미지 URL 포함
      value: user.value,
    }));
  } catch (error) {
    console.error("Error fetching top net income users:", error);
    throw error;
  }
};

// 운행 시간
const getTopUsersByDrivingTime = async (
  filterType,
  filterValue,
  selectedMonth
) => {
  try {
    let vehicleFilterCondition = {};

    // 필터 타입과 값에 따라 필터링 조건 설정
    if (filterType === "carType" && filterValue && filterValue !== "전체") {
      vehicleFilterCondition = {
        carType: filterValue,
      };
    } else if (
      filterType === "jobtype" &&
      filterValue &&
      filterValue !== "전체"
    ) {
      const jobTypeMap = {
        택시: 1,
        배달: 2,
        기타: 3,
      };

      const mappedValue = jobTypeMap[filterValue];
      if (mappedValue !== undefined) {
        vehicleFilterCondition = {
          jobtype: mappedValue,
        };
      }
    }

    // 특정 월에 해당하는 driving_records 조건 추가
    const startDate = new Date(new Date().getFullYear(), selectedMonth - 1, 1);
    const endDate = new Date(new Date().getFullYear(), selectedMonth, 1);

    // 차량 정보를 필터링하여 사용자 ID를 추출
    const userVehicles = await prisma.user_vehicles.findMany({
      where: vehicleFilterCondition,
      select: {
        userId: true,
      },
    });

    // 필터링된 사용자 ID 목록
    const userIds = userVehicles.map((uv) => uv.userId);

    // 사용자 정보를 조회 (닉네임과 프로필 이미지 URL 포함)
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        user_profiles: {
          select: {
            imageUrl: true,
          },
        },
        driving_logs: {
          include: {
            driving_records: {
              where: {
                created_at: {
                  gte: startDate,
                  lt: endDate,
                },
              },
            },
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
        imageUrl: user.user_profiles?.imageUrl || null, // 프로필 이미지 URL 추가
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
      imageUrl: user.imageUrl, // 프로필 이미지 URL 포함
      value: user.formattedValue,
    }));
  } catch (error) {
    console.error("Error fetching top users by driving time:", error);
    throw error;
  }
};

// 연비 랭킹
const getTopUsersByFuelEfficiency = async (
  filterType,
  filterValue,
  selectedMonth
) => {
  try {
    let fuelTypeCondition = {};

    if (filterType === "fuelType" && filterValue && filterValue !== "전체") {
      fuelTypeCondition = {
        user_vehicles: {
          fuel_type: filterValue,
        },
      };
    }

    // users와 관련된 driving_logs와 driving_records를 가져오고, user_profiles에서 imageUrl을 가져옴
    const users = await prisma.users.findMany({
      where: {
        ...fuelTypeCondition,
      },
      include: {
        driving_logs: {
          include: {
            driving_records: {
              where: {
                // created_at 필드에서 selectedMonth에 해당하는 데이터를 필터링
                created_at: {
                  gte: new Date(new Date().getFullYear(), selectedMonth - 1, 1),
                  lt: new Date(new Date().getFullYear(), selectedMonth, 1),
                },
              },
            },
          },
        },
        user_profiles: {
          select: {
            imageUrl: true,
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
        imageUrl: user.user_profiles?.imageUrl || null, // imageUrl 추가
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
const getTopDrivingDistanceUsersModel = async (
  filterType,
  filterValue,
  selectedMonth
) => {
  try {
    let vehicleFilterCondition = {};

    // 필터 타입과 값에 따라 필터링 조건 설정
    if (filterType === "carType" && filterValue && filterValue !== "전체") {
      vehicleFilterCondition = {
        carType: filterValue,
      };
    } else if (filterType === "jobtype") {
      const jobTypeMap = {
        택시: 1,
        배달: 2,
        기타: 3,
      };

      const mappedValue = jobTypeMap[filterValue];
      if (mappedValue !== undefined) {
        vehicleFilterCondition = {
          jobtype: mappedValue,
        };
      }
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
            driving_records: {
              where: {
                created_at: {
                  gte: new Date(new Date().getFullYear(), selectedMonth - 1, 1),
                  lt: new Date(new Date().getFullYear(), selectedMonth, 1),
                },
              },
              select: {
                driving_distance: true,
              },
            },
          },
        },
        user_profiles: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    // 각 사용자의 총 주행 거리 계산
    const usersWithTotalDistance = users.map((user) => {
      const totalDistance = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + (record.driving_distance || 0),
            0
          ),
        0
      );

      return {
        id: user.id,
        nickname: user.nickname,
        imageUrl: user.user_profiles?.imageUrl || null, // 프로필 이미지 URL 추가
        value: totalDistance, // 숫자 값으로 저장
        formattedValue: `${totalDistance.toLocaleString("ko-KR")} km`, // 포맷된 값
      };
    });

    // 총 주행 거리가 높은 순서로 정렬
    usersWithTotalDistance.sort((a, b) => b.value - a.value);

    // 상위 5명 반환 (포맷된 값을 사용하여 반환)
    return usersWithTotalDistance.slice(0, 5).map((user) => ({
      id: user.id,
      nickname: user.nickname,
      imageUrl: user.imageUrl,
      value: user.formattedValue,
    }));
  } catch (error) {
    console.error("Error fetching top driving distance users:", error);
    throw error;
  }
};

// 총 건수 랭킹
const getTopTotalCasesUsersModel = async (
  filterType,
  filterValue,
  selectedMonth
) => {
  try {
    let vehicleFilterCondition = {};

    // 필터 타입과 값에 따라 필터링 조건 설정
    if (filterType === "carType" && filterValue && filterValue !== "전체") {
      vehicleFilterCondition = {
        carType: filterValue,
      };
    } else if (filterType === "jobtype") {
      const jobTypeMap = {
        택시: 1,
        배달: 2,
        기타: 3,
      };

      const mappedValue = jobTypeMap[filterValue];
      if (mappedValue !== undefined) {
        vehicleFilterCondition = {
          jobtype: mappedValue,
        };
      }
    }

    // 특정 월에 해당하는 vehicle 조건 추가
    if (selectedMonth) {
      const startDate = new Date(
        new Date().getFullYear(),
        selectedMonth - 1,
        1
      );
      const endDate = new Date(new Date().getFullYear(), selectedMonth, 0);

      vehicleFilterCondition.created_at = {
        gte: startDate,
        lt: endDate,
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
            driving_records: {
              where: {
                created_at: {
                  gte: new Date(new Date().getFullYear(), selectedMonth - 1, 1),
                  lt: new Date(new Date().getFullYear(), selectedMonth, 0),
                },
              },
              select: {
                total_driving_cases: true,
              },
            },
          },
        },
        user_profiles: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    // 각 사용자의 총 건수 계산
    const usersWithTotalCases = users.map((user) => {
      const totalCases = user.driving_logs.reduce(
        (acc, log) =>
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + (record.total_driving_cases || 0),
            0
          ),
        0
      );

      return {
        id: user.id,
        nickname: user.nickname,
        imageUrl: user.user_profiles?.imageUrl || null, // 프로필 이미지 URL 추가
        value: totalCases, // 숫자 값으로 저장
        formattedValue: `${totalCases.toLocaleString("ko-KR")} 건`, // 포맷된 값
      };
    });

    // 총 건수가 높은 순서로 정렬
    usersWithTotalCases.sort((a, b) => b.value - a.value);

    // 상위 5명 반환 (포맷된 값을 사용하여 반환)
    return usersWithTotalCases.slice(0, 5).map((user) => ({
      id: user.id,
      nickname: user.nickname,
      imageUrl: user.imageUrl,
      value: user.formattedValue,
    }));
  } catch (error) {
    console.error("Error fetching top total cases users:", error);
    throw error;
  }
};

// 이익만
async function getTopProfitLossUsersModel(
  filterType,
  filterValue,
  selectedMonth
) {
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
        whereCondition.jobtype = mappedValue;
      }
    } else if (filterType === "fuelType") {
      whereCondition.user_vehicles = {
        some: {
          fuel_type: filterValue,
        },
      };
    } else if (filterType === "carType") {
      whereCondition.user_vehicles = {
        some: {
          carType: filterValue,
        },
      };
    }
  }

  // 특정 월에 해당하는 expense_records 조건 추가
  const monthCondition = {};
  if (selectedMonth) {
    const month = parseInt(selectedMonth, 10); // selectedMonth를 정수로 변환
    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);
    monthCondition.created_at = {
      gte: startDate,
      lt: endDate,
    };
  }

  const users = await prisma.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      nickname: true,
      user_profiles: {
        select: {
          imageUrl: true,
        },
      },
      expense_records: {
        where: monthCondition, // 날짜 필터 추가
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
      imageUrl: user.user_profiles?.imageUrl || null, // 프로필 이미지 추가
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
    .map(({ id, nickname, imageUrl, value }) => ({
      id,
      nickname,
      imageUrl,
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
