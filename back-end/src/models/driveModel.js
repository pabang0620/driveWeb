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
  total_driving_cases,
  parsedStartTime,
  parsedEndTime,
}) => {
  try {
    // // ################### 최신 날짜가 아닌 경우
    const inputDate = date; // new Date()로 변환하지 않음

    // 해당 유저의 입력한 date 이후의 기록이 있는지 확인
    const existingRecordAfterDate = await prisma.driving_logs.findFirst({
      where: {
        userId: userId,
        date: {
          gt: inputDate, // 문자열 그대로 비교
        },
      },
    });

    // 해당 유저의 입력한 date 이전의 기록 중 가장 최신 기록을 찾음 (driving_logs 테이블에서 조회)
    const latestDrivingLogBeforeDate = await prisma.driving_logs.findFirst({
      where: {
        userId: userId,
        date: {
          lt: inputDate, // 입력한 날짜보다 이전의 기록을 조회
        },
      },
      orderBy: {
        date: "desc", // 날짜 기준으로 가장 최근 기록을 가져옴
      },
    });

    let previousMileage;

    if (latestDrivingLogBeforeDate) {
      // 가장 최신의 driving_log_id로 driving_records 테이블에서 누적 거리(cumulative_km) 가져옴
      const latestDrivingRecord = await prisma.driving_records.findFirst({
        where: {
          driving_log_id: latestDrivingLogBeforeDate.id, // 최신 로그의 ID로 조회
        },
        select: {
          cumulative_km: true, // 누적거리만 가져옴
        },
      });

      previousMileage = latestDrivingRecord?.cumulative_km || 0;
    } else {
      // 이전 기록이 없을 경우 user_vehicles의 mileage 값을 가져옴
      const vehicle = await prisma.user_vehicles.findUnique({
        where: { userId: userId },
        select: { mileage: true },
      });

      previousMileage = vehicle?.mileage || 0;
    }

    const vehicle = await prisma.user_vehicles.findUnique({
      where: { userId: userId },
      select: { mileage: true },
    });

    const car = await prisma.my_car.findUnique({
      where: { userId: userId },
      select: { mileage: true },
    });

    const drivingDistance = cumulative_km - previousMileage;

    const drivingLog = await prisma.driving_logs.create({
      data: {
        userId,
        date,
        memo,
      },
    });

    if (parsedEndTime < parsedStartTime) {
      parsedEndTime.setDate(parsedEndTime.getDate() + 1);
    }
    // working_hours 계산
    const workingHoursMilliseconds = Math.abs(parsedEndTime - parsedStartTime);
    const workingHoursSeconds = Math.floor(workingHoursMilliseconds / 1000); // 초 단위로 변환

    // 요일 계산
    const dayOfWeek = parsedStartTime.toLocaleString("en-US", {
      weekday: "long",
    });

    // 연비 계산
    const fuelEfficiency = drivingDistance / fuel_amount;

    // 영업률 계산
    const businessRate = (business_distance / drivingDistance) * 100;

    const drivingRecord = await prisma.driving_records.create({
      data: {
        driving_log_id: drivingLog.id,
        start_time,
        end_time,
        working_hours: new Date(workingHoursMilliseconds), // DateTime으로 저장
        working_hours_seconds: workingHoursSeconds, // 초 단위로 저장
        day_of_week: dayOfWeek,
        cumulative_km: Number(cumulative_km),
        driving_distance: Number(drivingDistance),
        business_distance: Number(business_distance),
        business_rate: Number(businessRate),
        fuel_amount: Number(fuel_amount),
        fuel_efficiency: Number(fuelEfficiency),
        total_driving_cases: Number(total_driving_cases),
        userId: userId,
      },
    });

    const incomeRecord = await prisma.income_records.create({
      data: {
        driving_log_id: drivingLog.id,
        userId,
      },
    });

    const expenseRecord = await prisma.expense_records.create({
      data: {
        driving_log_id: drivingLog.id,
        userId,
      },
    });

    // 누적거리 업데이트 (date 이후의 기록이 없는 경우에만)
    if (!existingRecordAfterDate) {
      await prisma.user_vehicles.updateMany({
        where: { userId: userId },
        data: {
          mileage: Number(cumulative_km),
        },
      });

      await prisma.my_car.updateMany({
        where: { userId: userId },
        data: {
          mileage: Number(cumulative_km),
        },
      });
    }

    const updatedMaintenanceRecords =
      await prisma.maintenance_records.updateMany({
        where: { userId: userId },
        data: {
          mileageAtMaintenance: {
            increment: Number(drivingDistance),
          },
        },
      });

    return {
      driving_log_id: drivingLog.id,
      working_hours_seconds: workingHoursSeconds,
    };
  } catch (error) {
    console.error("Error adding driving record in service:", error);
    throw error;
  }
};

// const addDrivingRecord = async (req, res) => {
//   const { userId } = req;
//   try {
//     const {
//       date,
//       start_time,
//       end_time,
//       cumulative_km,
//       business_distance,
//       fuel_amount,
//       memo,
//       total_driving_cases,
//     } = req.body;

//     // 계산을 위해 시간 파싱
//     const parsedStartTime = new Date(`${date}T${start_time}`);
//     const parsedEndTime = new Date(`${date}T${end_time}`);

//     // DateTime 객체가 유효한지 확인
//     if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
//       return res.status(400).json({ error: "Invalid date or time format" });
//     }

//     const result = await createDrivingRecord({
//       userId,
//       date,
//       start_time,
//       end_time,
//       cumulative_km,
//       business_distance,
//       fuel_amount,
//       memo,
//       total_driving_cases,
//       parsedStartTime,
//       parsedEndTime,
//     });

//     res.status(201).json(result);
//   } catch (error) {
//     console.error("Error adding driving record:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입
const updateIncomeRecord = async (id, data) => {
  try {
    console.log("updateIncomeRecord - id:", id, "data:", data);
    const updatedRecord = await prisma.income_records.update({
      where: { id: id },
      data: {
        card_income: data.card_income,
        cash_income: data.cash_income,
        kakao_income: data.kakao_income,
        uber_income: data.uber_income,
        onda_income: data.onda_income,
        tada_income: data.tada_income,
        iam_income: data.iam_income,
        etc_income: data.etc_income, // 추가된 부분
        other_income: data.other_income,
        income_spare_1: data.income_spare_1,
        income_spare_2: data.income_spare_2,
        income_spare_3: data.income_spare_3,
        income_spare_4: data.income_spare_4,
        total_income: data.total_income,
        income_per_km: data.income_per_km,
        income_per_hour: data.income_per_hour,
      },
    });
    return updatedRecord;
  } catch (error) {
    console.error("updateIncomeRecord error:", error);
    throw new Error("수입 기록 수정 중 오류가 발생했습니다.");
  }
};

const updateTotalIncome = async (id, data) => {
  try {
    const total_income =
      parseFloat(data.card_income || 0) +
      parseFloat(data.cash_income || 0) +
      parseFloat(data.kakao_income || 0) +
      parseFloat(data.uber_income || 0) +
      parseFloat(data.onda_income || 0) +
      parseFloat(data.tada_income || 0) +
      parseFloat(data.iam_income || 0) +
      parseFloat(data.etc_income || 0) +
      parseFloat(data.other_income || 0) +
      parseFloat(data.income_spare_1 || 0) +
      parseFloat(data.income_spare_2 || 0) +
      parseFloat(data.income_spare_3 || 0) +
      parseFloat(data.income_spare_4 || 0);

    // income_per_km와 income_per_hour 계산
    const business_distance = parseFloat(data.business_distance || 0);
    const working_hours_seconds = parseFloat(data.working_hours || 0);

    const income_per_km = business_distance
      ? business_distance / total_income
      : 0;

    const income_per_hour = working_hours_seconds
      ? total_income / (working_hours_seconds / 3600) // seconds to hours
      : 0;

    console.log("###########################################");
    console.log(total_income);
    console.log(working_hours_seconds);
    console.log(income_per_km);
    console.log(income_per_hour);
    const updatedRecord = await prisma.income_records.update({
      where: { id: id },
      data: {
        total_income: total_income,
        income_per_km: income_per_km,
        income_per_hour: income_per_hour,
      },
    });

    return updatedRecord;
  } catch (error) {
    console.error("updateTotalIncome error:", error);
    throw new Error("수입 합계 업데이트 중 오류가 발생했습니다.");
  }
};

const findIncomeRecordByDrivingLogId = async (driving_log_id) => {
  try {
    // console.log(
    //   "findIncomeRecordByDrivingLogId - driving_log_id:",
    //   driving_log_id
    // );
    const incomeRecord = await prisma.income_records.findFirst({
      where: { driving_log_id: Number(driving_log_id) },
      select: { id: true },
    });
    return incomeRecord;
  } catch (error) {
    console.error("findIncomeRecordByDrivingLogId error:", error);
    throw new Error("수입 기록 조회 중 오류가 발생했습니다.");
  }
};

const getFranchiseFees = async (userId) => {
  try {
    // console.log("getFranchiseFees - userId:", userId);
    const fees = await prisma.franchise_fees.findMany({
      where: { userId: Number(userId) },
      select: {
        franchise_name: true,
        fee: true,
      },
    });
    return fees;
  } catch (error) {
    console.error("getFranchiseFees error:", error);
    throw new Error("프랜차이즈 수수료 조회 중 오류가 발생했습니다.");
  }
};

// 수입 기록시 사용되는 지출 수정
const createOrUpdateExpenseRecord = async (driving_log_id, data) => {
  try {
    // console.log(
    //   "createOrUpdateExpenseRecord - driving_log_id:",
    //   driving_log_id,
    //   "data:",
    //   data
    // );

    let expenseRecord = await prisma.expense_records.findFirst({
      where: { driving_log_id: Number(driving_log_id) },
    });

    if (expenseRecord) {
      expenseRecord = await prisma.expense_records.update({
        where: { id: expenseRecord.id },
        data: {
          card_fee: data.card_fee,
          kakao_fee: data.kakao_fee,
          uber_fee: data.uber_fee,
          onda_fee: data.onda_fee,
          tada_fee: data.tada_fee,
          iam_fee: data.iam_fee,
          etc_fee: data.etc_fee,
          other_expense: data.other_expense,
        },
      });
    } else {
      expenseRecord = await prisma.expense_records.create({
        data: {
          driving_log_id: Number(driving_log_id),
          card_fee: data.card_fee,
          kakao_fee: data.kakao_fee,
          uber_fee: data.uber_fee,
          onda_fee: data.onda_fee,
          tada_fee: data.tada_fee,
          iam_fee: data.iam_fee,
          etc_fee: data.etc_fee,
          other_expense: data.other_expense,
        },
      });
    }

    return expenseRecord;
  } catch (error) {
    console.error("createOrUpdateExpenseRecord error:", error);
    throw new Error("지출 기록 생성 또는 업데이트 중 오류가 발생했습니다.");
  }
};

const updateExpenseRecordByDrivingLogId = async (driving_log_id, data) => {
  try {
    console.log(
      "updateExpenseRecordByDrivingLogId - driving_log_id:",
      driving_log_id,
      "data:",
      data
    );

    let expenseRecord = await prisma.expense_records.findFirst({
      where: { driving_log_id: parseInt(driving_log_id) },
    });

    if (!expenseRecord) {
      throw new Error("Expense record not found");
    }

    // 기존 수수료 데이터를 가져옵니다.
    const {
      card_fee = 0,
      kakao_fee = 0,
      uber_fee = 0,
      onda_fee = 0,
      tada_fee = 0,
      iam_fee = 0,
      etc_fee = 0,
    } = expenseRecord;

    // 지출의 합계를 계산하여 total_expense에 넣음
    const totalExpense =
      parseFloat(data.fuel_expense || 0) +
      parseFloat(data.toll_fee || 0) +
      parseFloat(data.meal_expense || 0) +
      parseFloat(data.fine_expense || 0) +
      parseFloat(data.other_expense || 0) +
      parseFloat(data.expense_spare_1 || 0) +
      parseFloat(data.expense_spare_2 || 0) +
      parseFloat(data.expense_spare_3 || 0) +
      parseFloat(data.expense_spare_4 || 0) +
      parseFloat(card_fee) +
      parseFloat(kakao_fee) +
      parseFloat(uber_fee) +
      parseFloat(onda_fee) +
      parseFloat(tada_fee) +
      parseFloat(iam_fee) +
      parseFloat(etc_fee);

    // 실제 지출 합계를 계산하여 수수료를 제외한 값만 사용
    const actualExpense =
      parseFloat(data.fuel_expense || 0) +
      parseFloat(data.toll_fee || 0) +
      parseFloat(data.meal_expense || 0) +
      parseFloat(data.fine_expense || 0) +
      parseFloat(data.other_expense || 0) +
      parseFloat(data.expense_spare_1 || 0) +
      parseFloat(data.expense_spare_2 || 0) +
      parseFloat(data.expense_spare_3 || 0) +
      parseFloat(data.expense_spare_4 || 0);

    const totalIncomeRecord = await prisma.income_records.findFirst({
      where: { driving_log_id: parseInt(driving_log_id) },
      select: { total_income: true },
    });

    const totalIncome = totalIncomeRecord
      ? parseFloat(totalIncomeRecord.total_income)
      : 0;

    const profitLoss = totalIncome - actualExpense;

    const updatedRecord = await prisma.expense_records.update({
      where: { id: expenseRecord.id },
      data: {
        fuel_expense: parseFloat(data.fuel_expense || 0),
        toll_fee: parseFloat(data.toll_fee || 0),
        meal_expense: parseFloat(data.meal_expense || 0),
        fine_expense: parseFloat(data.fine_expense || 0),
        other_expense: parseFloat(data.other_expense || 0),
        expense_spare_1: parseFloat(data.expense_spare_1 || 0),
        expense_spare_2: parseFloat(data.expense_spare_2 || 0),
        expense_spare_3: parseFloat(data.expense_spare_3 || 0),
        expense_spare_4: parseFloat(data.expense_spare_4 || 0),
        card_fee: parseFloat(card_fee),
        kakao_fee: parseFloat(kakao_fee),
        uber_fee: parseFloat(uber_fee),
        onda_fee: parseFloat(onda_fee),
        tada_fee: parseFloat(tada_fee),
        iam_fee: parseFloat(iam_fee),
        etc_fee: parseFloat(etc_fee),
        total_expense: totalExpense,
        profit_loss: profitLoss,
      },
    });

    return updatedRecord;
  } catch (error) {
    console.error("updateExpenseRecordByDrivingLogId error:", error);
    throw new Error("지출 기록 수정 중 오류가 발생했습니다.");
  }
};

const calculateProfitLoss = async (driving_log_id) => {
  try {
    console.log("calculateProfitLoss - driving_log_id:", driving_log_id);

    const expenseRecord = await prisma.expense_records.findFirst({
      where: { driving_log_id: parseInt(driving_log_id) },
    });

    if (!expenseRecord) {
      throw new Error("Expense record not found");
    }

    const incomeRecord = await prisma.income_records.findFirst({
      where: { driving_log_id: parseInt(driving_log_id) },
    });

    if (!incomeRecord) {
      throw new Error("Income record not found");
    }

    const totalIncome = parseFloat(incomeRecord.total_income);
    const totalExpense = parseFloat(expenseRecord.total_expense);

    const profitLoss = totalIncome - totalExpense;

    await prisma.expense_records.update({
      where: { id: expenseRecord.id },
      data: {
        profit_loss: profitLoss,
      },
    });
  } catch (error) {
    console.error("calculateProfitLoss error:", error);
    throw new Error("profit_loss 계산 중 오류가 발생했습니다.");
  }
};
// 겟 겟겟겟
const getDrivingLogs = async (userId, memo, selectedYear, selectedMonth) => {
  const queryOptions = {
    where: {
      userId: userId,
    },
    select: {
      id: true,
      date: true,
      created_at: true,
      driving_records: {
        select: {
          driving_distance: true,
          working_hours: true,
        },
      },
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
    orderBy: {
      date: "desc",
    },
  };

  // 날짜 필터를 적용하기 위한 조건 추가 (YYYY-MM-DD 형식으로 비교)
  if (selectedYear && selectedMonth) {
    // 해당 월의 첫날과 마지막 날을 YYYY-MM-DD 형식으로 계산
    const startDate = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-01`;
    const endDate = new Date(selectedYear, selectedMonth, 0)
      .toISOString()
      .split("T")[0]; // 마지막 날짜 계산

    queryOptions.where.date = {
      gte: startDate, // 시작일 (예: 2024-08-01)
      lte: endDate, // 종료일 (예: 2024-08-31)
    };
  }

  if (memo) {
    queryOptions.where.memo = {
      contains: memo,
    };
  }

  try {
    const drivingLogs = await prisma.driving_logs.findMany(queryOptions);
    return drivingLogs.map((log) => ({
      driving_log_id: log.id,
      date: log.date,
      created_at: log.created_at,
      driving_distance: log.driving_records[0]?.driving_distance || 0,
      working_hours: log.driving_records[0]?.working_hours || 0,
      total_income: log.income_records[0]?.total_income || 0,
      total_expense: log.expense_records[0]?.total_expense || 0,
    }));
  } catch (error) {
    console.error("Error in model while getting driving logs:", error);
    throw error;
  }
};

const getDrivingLogDetails = async (driving_log_id) => {
  try {
    const drivingLog = await prisma.driving_logs.findUnique({
      where: { id: Number(driving_log_id) },
      include: {
        driving_records: true,
        income_records: true,
        expense_records: true,
      },
    });

    return drivingLog;
  } catch (error) {
    console.error("Error fetching driving log details:", error);
    throw new Error("Error fetching driving log details");
  }
};

const filterZeroValues = (obj) => {
  const filtered = {};
  for (const key in obj) {
    if (
      obj[key] !== 0 &&
      obj[key] !== "0" &&
      obj[key] !== null &&
      obj[key] !== "null"
    ) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
};
// 랭킹
// 랭킹
// 랭킹
// 랭킹
// 총 운행시간 랭크
const getTopUsersByDrivingTime = async (jobtype) => {
  try {
    // console.log("Fetching top users by driving time...");

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

    // console.log(
    //   "Top 5 users by net income fetched successfully:",
    //   usersWithNetIncome.slice(0, 5)
    // );
    return usersWithNetIncome.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users by net income:", error);
    throw error;
  }
};

// 연비 랭크
const getTopUsersByFuelEfficiency = async (fuelType) => {
  try {
    // console.log("Fetching top users by fuel efficiency...");

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

// 운행 일지와 기록 가져오기
const getDrivingLogWithRecords = async (driving_log_id) => {
  return await prisma.driving_logs.findUnique({
    where: { id: Number(driving_log_id) },
    include: {
      driving_records: true,
    },
  });
};

// 수입 기록 가져오기
const getIncomeRecordByDrivingLogId = async (driving_log_id) => {
  return await prisma.income_records.findFirst({
    where: { driving_log_id: Number(driving_log_id) },
  });
};

// 지출 기록 가져오기
const getExpenseRecordByDrivingLogId = async (driving_log_id) => {
  return await prisma.expense_records.findFirst({
    where: { driving_log_id: Number(driving_log_id) },
  });
};

// 운행 수정
const getDrivingRecordByLogId = async (driving_log_id) => {
  try {
    const record = await prisma.driving_records.findFirst({
      where: { driving_log_id: Number(driving_log_id) },
    });
    return record;
  } catch (error) {
    console.error(`Error in getDrivingRecordByLogId: ${error.message}`);
    throw error;
  }
};

// 운행 기록 업데이트
const updateDrivingRecord = async (driving_log_id, data) => {
  try {
    return await prisma.driving_records.updateMany({
      where: { driving_log_id: Number(driving_log_id) },
      data,
    });
  } catch (error) {
    console.error(`Error in updateDrivingRecord: ${error.message}`);
    throw error;
  }
};

// 운행 일지 업데이트
const updateDrivingLog = async (driving_log_id, data) => {
  try {
    return await prisma.driving_logs.update({
      where: { id: Number(driving_log_id) },
      data,
    });
  } catch (error) {
    console.error(`Error in updateDrivingLog: ${error.message}`);
    throw error;
  }
};

// 최신 운행 일지인지 확인
const isLatestDrivingLog = async (userId, driving_log_id) => {
  try {
    const latestLog = await prisma.driving_logs.findFirst({
      where: { userId: userId },
      orderBy: { date: "desc" },
      select: { id: true },
    });
    return latestLog && latestLog.id === Number(driving_log_id);
  } catch (error) {
    console.error(`Error in isLatestDrivingLog: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createDrivingRecord,
  // -----------------------
  getFranchiseFees,
  findIncomeRecordByDrivingLogId,
  updateIncomeRecord,
  updateTotalIncome,
  // ----------------------
  createOrUpdateExpenseRecord,
  updateExpenseRecordByDrivingLogId,
  calculateProfitLoss,
  getDrivingLogs,
  getDrivingLogDetails,
  filterZeroValues,
  // ----------------------
  getTopUsersByDrivingTime,
  getTopUsersByNetIncome,
  getTopUsersByFuelEfficiency,
  // 운행일지 수정을 위한 get
  getDrivingLogWithRecords,
  getIncomeRecordByDrivingLogId,
  getExpenseRecordByDrivingLogId,
  // 운행 수정
  getDrivingRecordByLogId,
  updateDrivingRecord,
  updateDrivingLog,
  isLatestDrivingLog,
};
