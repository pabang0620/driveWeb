const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 운행일지 - 운행  // 운행일지 - 운행 // 운행일지 - 운행 // 운행일지 - 운행
const createDrivingLog = async (userId, date, memo) => {
  return await prisma.driving_logs.create({
    data: {
      userId,
      date: new Date(date),
      memo,
    },
  });
};

const createDrivingRecord = async (
  drivingLogId,
  startTime,
  endTime,
  cumulativeKm,
  businessDistance,
  fuelAmount,
  totalDrivingCases
) => {
  const startTimeObj = new Date(startTime);
  const endTimeObj = new Date(endTime);
  const workingHours = (endTimeObj - startTimeObj) / (1000 * 60 * 60); // 시간 단위로 계산

  // 요일 계산
  const dayOfWeek = startTimeObj.toLocaleString("en-US", { weekday: "long" });

  // 주행 거리 계산
  const drivingLog = await prisma.driving_logs.findUnique({
    where: { id: drivingLogId },
    include: { users: true },
  });

  if (!drivingLog) {
    throw new Error("Driving log not found");
  }

  const userVehicle = await prisma.user_vehicles.findFirst({
    where: { userId: drivingLog.userId },
  });

  if (!userVehicle) {
    throw new Error("User vehicle not found");
  }

  const drivingDistance = cumulativeKm - userVehicle.mileage;

  // 연비 계산
  const fuelEfficiency = (drivingDistance / fuelAmount).toFixed(2);

  // 영업률 계산 (다른 로직 추가 예정)
  const businessRate = ((businessDistance / drivingDistance) * 100).toFixed(2);

  // 누적 KM 업데이트
  await prisma.user_vehicles.update({
    where: { id: userVehicle.id },
    data: { mileage: cumulativeKm },
  });

  await prisma.my_car.updateMany({
    where: { userId: drivingLog.userId },
    data: { mileage: cumulativeKm },
  });

  const newRecord = await prisma.driving_records.create({
    data: {
      drivingLogId,
      startTime: startTimeObj,
      endTime: endTimeObj,
      workingHours,
      dayOfWeek,
      cumulativeKm,
      drivingDistance,
      businessDistance,
      businessRate,
      fuelAmount,
      fuelEfficiency,
      totalDrivingCases,
    },
  });

  console.log("New driving record created:", newRecord);

  return newRecord;
};

const updateUserMileages = async (
  userId,
  drivingDistance,
  businessDistance
) => {
  const totalDistance = drivingDistance + businessDistance;

  // my_car 테이블의 mileage 업데이트
  await prisma.my_car.updateMany({
    where: { userId },
    data: {
      mileage: {
        set: prisma.raw(`IFNULL(mileage, 0) + ${totalDistance}`),
      },
    },
  });

  // user_vehicles 테이블의 mileage 업데이트
  await prisma.user_vehicles.updateMany({
    where: { userId },
    data: {
      mileage: {
        set: prisma.raw(`IFNULL(mileage, 0) + ${totalDistance}`),
      },
    },
  });

  // maintenance_records 테이블에서 가장 최근의 mileageAtMaintenance 업데이트
  const latestMaintenanceRecord = await prisma.maintenance_records.findFirst({
    where: { userId },
    orderBy: { id: "desc" },
  });

  if (latestMaintenanceRecord) {
    await prisma.maintenance_records.update({
      where: { id: latestMaintenanceRecord.id },
      data: {
        mileageAtMaintenance: {
          set: prisma.raw(`IFNULL(mileageAtMaintenance, 0) + ${totalDistance}`),
        },
      },
    });
  }

  return {
    message: "Mileage updated successfully",
  };
};

const updateDrivingRecord = async (id, data) => {
  return await prisma.driving_records.update({
    where: { id },
    data,
  });
};
const deleteDrivingRecord = async (id) => {
  return await prisma.driving_records.delete({
    where: { id },
  });
};

// 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입

const updateIncomeRecord = async (id, data) => {
  const {
    drivingLogId,
    cardIncome,
    cashIncome,
    kakaoIncome,
    uberIncome,
    ondaIncome,
    tadaIncome,
    otherIncome,
    incomeSpare1,
    incomeSpare2,
    incomeSpare3,
    incomeSpare4,
  } = data;

  const drivingRecord = await prisma.driving_records.findUnique({
    where: { drivingLogId },
  });

  if (!drivingRecord) {
    throw new Error("Driving record not found");
  }

  const drivingDistance = drivingRecord.drivingDistance;
  const workingHours = drivingRecord.workingHours;

  const totalIncome =
    (cardIncome || 0) +
    (cashIncome || 0) +
    (kakaoIncome || 0) +
    (uberIncome || 0) +
    (ondaIncome || 0) +
    (tadaIncome || 0) +
    (otherIncome || 0) +
    (incomeSpare1 || 0) +
    (incomeSpare2 || 0) +
    (incomeSpare3 || 0) +
    (incomeSpare4 || 0);

  const incomePerKm = totalIncome / drivingDistance;
  const incomePerHour = totalIncome / workingHours;

  return await prisma.income_records.update({
    where: { id },
    data: {
      cardIncome,
      cashIncome,
      kakaoIncome,
      uberIncome,
      ondaIncome,
      tadaIncome,
      otherIncome,
      incomeSpare1,
      incomeSpare2,
      incomeSpare3,
      incomeSpare4,
      totalIncome,
      incomePerKm,
      incomePerHour,
    },
  });
};
const deleteIncomeRecord = async (id) => {
  return await prisma.incomeRecord.delete({
    where: { id },
  });
};
// 운행일지 - 지출 // 운행일지 - 지출 // 운행일지 - 지출 // 운행일지 - 지출 // 운행일지 - 지출
const updateExpenseRecord = async (id, data) => {
  const {
    drivingLogId,
    fuelCost,
    tollCost,
    mealCost,
    fineCost,
    otherExpense,
    expenseSpare1,
    expenseSpare2,
    expenseSpare3,
    expenseSpare4,
  } = data;

  // 가맹점 수수료 계산
  const franchiseFees = await prisma.franchise_fees.findMany({
    where: { userId: drivingLogId },
  });

  const totalFranchiseFee = franchiseFees.reduce(
    (acc, fee) => acc + fee.fee,
    0
  );

  const totalExpense =
    totalFranchiseFee +
    (fuelCost || 0) +
    (tollCost || 0) +
    (mealCost || 0) +
    (fineCost || 0) +
    (otherExpense || 0) +
    (expenseSpare1 || 0) +
    (expenseSpare2 || 0) +
    (expenseSpare3 || 0) +
    (expenseSpare4 || 0);

  const incomeRecord = await prisma.income_records.findFirst({
    where: { drivingLogId },
  });

  if (!incomeRecord) {
    throw new Error("Income record not found");
  }

  const netIncome = (incomeRecord.total_income || 0) - totalExpense;

  return await prisma.expense_records.update({
    where: { id },
    data: {
      franchiseFee: totalFranchiseFee,
      fuelCost,
      tollCost,
      mealCost,
      fineCost,
      otherExpense,
      expenseSpare1,
      expenseSpare2,
      expenseSpare3,
      expenseSpare4,
      totalExpense,
      netIncome,
    },
  });
};
const deleteExpenseRecord = async (id) => {
  return await prisma.expense_records.delete({
    where: { id },
  });
};

// 랭킹
// 랭킹
// 랭킹
// 랭킹
// 총 운행시간 랭크
const getTopUsersByDrivingTime = async (jobtype) => {
  try {
    console.log("Fetching top users by driving time...");

    const jobTypeMap = {
      전체직종: undefined,
      택시: 1,
      배달: 2,
      기타: 3,
    };

    const jobTypeFilter = jobTypeMap[jobtype]
      ? { jobtype: jobTypeMap[jobtype] }
      : {};

    const users = await prisma.users.findMany({
      where: jobTypeFilter,
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

    // 유저별 총 운행 시간 계산
    const usersWithTotalDrivingTime = users.map((user) => {
      const totalDrivingTime = user.driving_logs.reduce((acc, log) => {
        const logDrivingTime = log.driving_records.reduce(
          (logAcc, record) => logAcc + record.working_hours.getHours(),
          0
        );
        return acc + logDrivingTime;
      }, 0);

      return {
        id: user.id,
        nickname: user.nickname,
        totalDrivingTime,
      };
    });

    // 총 운행 시간이 높은 순으로 상위 5명 가져오기
    usersWithTotalDrivingTime.sort(
      (a, b) => b.totalDrivingTime - a.totalDrivingTime
    );

    // console.log(
    //   "Top 5 users by driving time fetched successfully:",
    //   usersWithTotalDrivingTime.slice(0, 5)
    // );
    return usersWithTotalDrivingTime.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by driving time:", error);
    throw error;
  }
};

// 총 순이익 랭크
const getTopUsersByNetIncome = async (carType) => {
  try {
    console.log("Fetching top users by net income...");
    const users = await prisma.users.findMany({
      where:
        carType && carType !== "전체"
          ? {
              user_vehicles: {
                some: {
                  carType: carType,
                },
              },
            }
          : {},
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

    // 유저별 순수익 계산
    const usersWithNetIncome = users.map((user) => {
      const totalIncome = user.income_records.reduce((acc, record) => {
        const income = parseFloat(record.total_income) || 0;
        if (isNaN(income) || income < 0) {
          console.warn(`Invalid income for user ${user.id}: ${income}`);
          return acc;
        }
        return acc + income;
      }, 0);

      const totalExpense = user.expense_records.reduce((acc, record) => {
        const expense = parseFloat(record.total_expense) || 0;
        if (isNaN(expense) || expense < 0) {
          console.warn(`Invalid expense for user ${user.id}: ${expense}`);
          return acc;
        }
        return acc + expense;
      }, 0);

      const netIncome = totalIncome - totalExpense;

      // console.log(
      //   `User ${user.id} - Total Income: ${totalIncome}, Total Expense: ${totalExpense}, Net Income: ${netIncome}`
      // );

      return {
        id: user.id,
        nickname: user.nickname,
        netIncome,
      };
    });

    // 순수익이 높은 순으로 상위 5명 가져오기
    usersWithNetIncome.sort((a, b) => b.netIncome - a.netIncome);

    console.log(
      "Top 5 users by net income fetched successfully:",
      usersWithNetIncome.slice(0, 5)
    );
    return usersWithNetIncome.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by net income:", error);
    throw error;
  }
};

// 연비 랭크
const getTopUsersByFuelEfficiency = async (fuelType) => {
  try {
    console.log("Fetching top users by fuel efficiency...");

    const fuelTypeMap = {
      전체: undefined,
      LPG: "LPG",
      전기: "전기",
      휘발유: "휘발유",
      경유: "경유",
      하이브리드: "하이브리드",
      천연가스: "천연가스",
      수소: "수소",
      바이오디젤: "바이오디젤",
      에탄올: "에탄올",
      기타: "기타",
    };

    const fuelTypeFilter = fuelTypeMap[fuelType]
      ? { user_vehicles: { fuel_type: fuelTypeMap[fuelType] } }
      : {};

    const users = await prisma.users.findMany({
      where: fuelTypeFilter,
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
      const totalDistance = user.driving_logs.reduce((acc, log) => {
        return (
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + record.driving_distance,
            0
          )
        );
      }, 0);
      const totalFuel = user.driving_logs.reduce((acc, log) => {
        return (
          acc +
          log.driving_records.reduce(
            (logAcc, record) => logAcc + record.fuel_amount,
            0
          )
        );
      }, 0);

      const fuelEfficiency = totalFuel > 0 ? totalDistance / totalFuel : 0;

      return {
        id: user.id,
        nickname: user.nickname,
        fuelEfficiency: parseFloat(fuelEfficiency.toFixed(2)),
      };
    });

    usersWithFuelEfficiency.sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);

    // console.log(
    //   "Top 5 users by fuel efficiency fetched successfully:",
    //   usersWithFuelEfficiency.slice(0, 5)
    // );
    return usersWithFuelEfficiency.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by fuel efficiency:", error);
    throw error;
  }
};

module.exports = {
  createDrivingLog,
  createDrivingRecord,
  updateUserMileages,
  updateDrivingRecord,
  deleteDrivingRecord,
  // -----------------------
  updateIncomeRecord,
  deleteIncomeRecord,
  // ----------------------
  updateExpenseRecord,
  deleteExpenseRecord,
  // ----------------------
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
};
