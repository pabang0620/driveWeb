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
// -----------------------------------------------
// 총 운송수입금 랭킹 - 끝

const getTopNetIncomeUsers = async (filterType, filterValue, selectedMonth) => {
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

    // 날짜 필터링을 `driving_logs` 테이블의 created_at 필드에 적용
    let startDate, endDate;
    const currentYear = new Date().getFullYear();

    if (selectedMonth === new Date().getMonth() + 1) {
      // 이번 달인 경우 오늘 날짜까지 필터링
      startDate = new Date(currentYear, selectedMonth - 1, 1);
      endDate = new Date(); // 오늘 날짜로 설정
    } else {
      // 선택한 달의 첫째 날과 마지막 날 설정
      startDate = new Date(currentYear, selectedMonth - 1, 1);
      endDate = new Date(currentYear, selectedMonth, 0); // 해당 달의 마지막 날 설정
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

    // 사용자와 관련된 수입 정보를 조회
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
          where: {
            date: {
              // `driving_logs` 테이블에서 날짜 필터링 적용
              gte: startDate.toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식
              lt: endDate.toISOString().slice(0, 10),
            },
          },
          include: {
            income_records: {
              select: {
                total_income: true,
              },
            },
          },
        },
      },
    });

    // 각 사용자의 총 수입 계산
    const usersWithTotalIncome = users.map((user) => {
      const totalIncome = user.driving_logs.reduce((logAcc, log) => {
        return (
          logAcc +
          log.income_records.reduce(
            (incomeAcc, record) =>
              incomeAcc + parseFloat(record.total_income || 0),
            0
          )
        );
      }, 0);

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

// 운행 시간 - 끝
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
          where: {
            date: {
              gte: startDate.toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식으로 변환
              lt: endDate.toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식으로 변환
            },
          },
          include: {
            driving_records: {
              select: {
                working_hours_seconds: true,
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

// 연비 랭킹 - 끝
const getTopUsersByFuelEfficiency = async (
  filterType,
  filterValue,
  selectedMonth
) => {
  try {
    let fuelTypeCondition = {};

    // 필터 타입에 따른 조건 설정
    if (filterType === "fuelType" && filterValue && filterValue !== "전체") {
      fuelTypeCondition = {
        user_vehicles: {
          fuel_type: filterValue,
        },
      };
    }

    // 날짜 범위를 선택한 월에 맞게 설정
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, selectedMonth - 1, 1);
    const endDate = new Date(currentYear, selectedMonth, 0); // 해당 월의 마지막 날

    // 사용자 데이터를 조회 (driving_logs, driving_records, user_profiles 포함)
    const users = await prisma.users.findMany({
      where: {
        ...fuelTypeCondition,
      },
      include: {
        driving_logs: {
          where: {
            date: {
              gte: startDate.toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식
              lt: endDate.toISOString().slice(0, 10),
            },
          },
          include: {
            driving_records: {
              select: {
                driving_distance: true,
                fuel_amount: true,
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

    // 각 사용자의 총 주행 거리 및 연료 소모량 계산
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

    // 연비가 높은 순서로 정렬
    usersWithFuelEfficiency.sort(
      (a, b) => parseFloat(b.value) - parseFloat(a.value)
    );

    // 상위 5명의 연비 반환
    return usersWithFuelEfficiency.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by fuel efficiency:", error);
    throw error;
  }
};

// 주행 거리 랭킹 - 끝
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

    // 날짜 범위 설정 (선택된 달의 첫날과 마지막 날 설정)
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-01`; // 선택한 달의 1일
    const endDate = `${currentYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-${new Date(currentYear, selectedMonth, 0).getDate()}`; // 선택한 달의 마지막 날

    // 사용자 정보를 조회
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        driving_logs: {
          where: {
            // `driving_logs`의 `date` 필드로 날짜 필터링 적용
            date: {
              gte: startDate, // 'YYYY-MM-DD' 형식으로 필터링
              lt: endDate,
            },
          },
          include: {
            driving_records: {
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

// 총 건수 랭킹 - 끝
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

    // 특정 월에 해당하는 vehicle 조건 추가는 필요하지 않음 (driving_logs에 필터 적용)
    let startDate, endDate;
    const currentYear = new Date().getFullYear();

    // selectedMonth를 기준으로 필터링 날짜 설정
    if (selectedMonth === new Date().getMonth() + 1) {
      // 이번 달인 경우 오늘 날짜까지 필터링
      startDate = new Date(currentYear, selectedMonth - 1, 1);
      endDate = new Date(); // 오늘 날짜로 설정
    } else {
      // 선택한 달의 첫째 날과 마지막 날 설정
      startDate = new Date(currentYear, selectedMonth - 1, 1);
      endDate = new Date(currentYear, selectedMonth, 0); // 해당 달의 마지막 날 설정
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
          where: {
            date: {
              // `driving_logs` 테이블에서 날짜 필터링 적용
              gte: startDate.toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식
              lt: endDate.toISOString().slice(0, 10),
            },
          },
          include: {
            driving_records: {
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

  // 특정 월에 해당하는 driving_logs의 date 필드로 필터링 조건 추가
  const drivingLogsDateCondition = {};
  if (selectedMonth) {
    const month = parseInt(selectedMonth, 10); // selectedMonth를 정수로 변환
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, month - 1, 1);
    const endDate = new Date(currentYear, month, 0);
    drivingLogsDateCondition.date = {
      gte: startDate.toISOString().slice(0, 10), // 'YYYY-MM-DD' 형식
      lt: endDate.toISOString().slice(0, 10),
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
      driving_logs: {
        where: drivingLogsDateCondition, // 날짜 필터링 추가
        select: {
          income_records: {
            select: {
              total_income: true,
            },
          },
          expense_records: {
            select: {
              profit_loss: true,
            },
          },
        },
      },
    },
  });

  // 각 사용자의 순이익 합산
  const usersWithTotalProfitLoss = users.map((user) => {
    // 총 수익과 지출을 기반으로 순이익 계산
    const totalProfitLoss = user.driving_logs.reduce((acc, log) => {
      const profitLossValue = log.expense_records.reduce((logAcc, record) => {
        return logAcc + parseFloat(record.profit_loss || 0);
      }, 0);
      return acc + profitLossValue;
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

const getUserById = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: parseInt(userId) },
    include: {
      user_profiles: true,
      user_incomes: true,
      user_vehicles: true,
    },
  });
};

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
  getUserById,
};
