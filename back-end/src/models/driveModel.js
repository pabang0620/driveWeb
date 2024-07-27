const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 운행일지 - 운행  // 운행일지 - 운행 // 운행일지 - 운행 // 운행일지 - 운행
const createDrivingRecord = async ({
  userId,
  date,
  start_time,
  end_time,
  cumulative_km,
  business_distance,
  fuel_amount,
  memo,
}) => {
  try {
    // driving_log 생성
    const drivingLog = await prisma.driving_logs.create({
      data: {
        userId,
        date,
        memo,
      },
    });

    console.log("Driving log created:", drivingLog);

    // working_hours 계산
    const workingHours = (end_time - start_time) / (1000 * 60 * 60); // 시간 단위로 계산

    // 요일 계산
    const dayOfWeek = start_time.toLocaleString("en-US", { weekday: "long" });

    // 연비 계산
    const fuelEfficiency = cumulative_km / fuel_amount;

    // 영업률 계산
    const businessRate = (business_distance / cumulative_km) * 100;

    // driving_record 생성
    const drivingRecord = await prisma.driving_records.create({
      data: {
        driving_log_id: drivingLog.id,
        start_time,
        end_time,
        working_hours: new Date(workingHours * 3600 * 1000), // 밀리초 단위로 변환
        day_of_week: dayOfWeek,
        cumulative_km: Number(cumulative_km),
        driving_distance: Number(cumulative_km),
        business_distance: Number(business_distance),
        business_rate: Number(businessRate),
        fuel_amount: Number(fuel_amount),
        fuel_efficiency: Number(fuelEfficiency),
        total_driving_cases: 1, // 예시 데이터
      },
    });

    console.log("Driving record created:", drivingRecord);

    // income_record 생성
    const incomeRecord = await prisma.income_records.create({
      data: {
        driving_log_id: drivingLog.id,
        userId,
        // 나머지 필드는 기본값으로 생성
      },
    });

    console.log("Income record created:", incomeRecord);

    // expense_record 생성
    const expenseRecord = await prisma.expense_records.create({
      data: {
        driving_log_id: drivingLog.id,
        userId,
        // 나머지 필드는 기본값으로 생성
      },
    });

    console.log("Expense record created:", expenseRecord);

    // user_vehicles 업데이트
    const updatedVehicle = await prisma.user_vehicles.updateMany({
      where: { userId: userId },
      data: {
        mileage: {
          increment: Number(cumulative_km),
        },
      },
    });

    console.log("User vehicles updated:", updatedVehicle);

    // my_car 업데이트
    const updatedCar = await prisma.my_car.updateMany({
      where: { userId: userId },
      data: {
        mileage: {
          increment: Number(cumulative_km),
        },
      },
    });

    console.log("My car updated:", updatedCar);

    // maintenance_records 업데이트
    const updatedMaintenanceRecords =
      await prisma.maintenance_records.updateMany({
        where: { userId: userId },
        data: {
          mileageAtMaintenance: {
            increment: Number(cumulative_km),
          },
        },
      });

    console.log("Maintenance records updated:", updatedMaintenanceRecords);

    // driving_log_id 반환
    return { driving_log_id: drivingLog.id };
  } catch (error) {
    console.error("Error adding driving record in service:", error);
    throw error;
  }
};
// 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입
const getFranchiseFees = async (userId) => {
  try {
    const fees = await prisma.franchise_fees.findMany({
      where: { userId },
      select: {
        franchise_name: true,
        fee: true,
      },
    });
    return fees;
  } catch (error) {
    throw new Error("프랜차이즈 수수료 가져오기 중 오류가 발생했습니다.");
  }
};

const findIncomeRecordById = async (id) => {
  try {
    const incomeRecord = await prisma.income_records.findUnique({
      where: { id: Number(id) },
      select: { userId: true },
    });
    return incomeRecord;
  } catch (error) {
    throw new Error("수입 기록 조회 중 오류가 발생했습니다.");
  }
};

const updateIncomeRecord = async (id, data) => {
  try {
    const updatedRecord = await prisma.income_records.update({
      where: { id },
      data,
    });
    return updatedRecord;
  } catch (error) {
    throw new Error("수입 기록 수정 중 오류가 발생했습니다.");
  }
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
  createDrivingRecord,
  // -----------------------
  getFranchiseFees,
  findIncomeRecordById,
  updateIncomeRecord,
  // ----------------------

  // ----------------------
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
};
