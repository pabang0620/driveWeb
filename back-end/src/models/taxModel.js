// /src/models/taxModel.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getIncomeDetailsForYear(year, userId) {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const drivingLogs = await prisma.driving_logs.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
    },
  });

  const logIds = drivingLogs.map((log) => log.id);

  const incomeRecords = await prisma.income_records.findMany({
    where: {
      driving_log_id: {
        in: logIds,
      },
    },
    select: {
      total_income: true,
    },
  });

  const totalIncome = incomeRecords.reduce((sum, record) => {
    const income = parseFloat(record.total_income) || 0;
    return sum + income;
  }, 0);

  // user_incomes 테이블에서 standard_expense_rate와 personal_deduction을 가져옵니다.
  const userIncomeDetails = await prisma.user_incomes.findUnique({
    where: {
      userId: userId,
    },
    select: {
      standard_expense_rate: true,
      personal_deduction: true,
    },
  });

  return {
    totalIncome,
    standardExpenseRate: userIncomeDetails?.standard_expense_rate || 0,
    personalDeduction: userIncomeDetails?.personal_deduction || 0,
  };
}

async function getStandardExpenseRate(userId) {
  const userIncome = await prisma.user_incomes.findUnique({
    where: {
      userId: userId,
    },
    select: {
      standard_expense_rate: true,
    },
  });

  // 만약 standard_expense_rate가 없을 경우 0으로 반환
  return userIncome?.standard_expense_rate || 0;
}

// 본인공제와 예상 종합 소득세 입력
async function taxUpdateUserIncome(
  userId,
  year,
  personalDeduction,
  estimatedTotalTax
) {
  const currentYear = new Date().getFullYear();

  // 연도가 현재 연도와 동일한지 확인
  if (year !== currentYear) {
    throw new Error("연도가 올바르지 않습니다.");
  }

  // 업데이트 쿼리
  return prisma.user_incomes.update({
    where: { userId: userId },
    data: {
      personal_deduction: personalDeduction,
      estimated_total_tax: estimatedTotalTax,
    },
  });
}

// 손익
// 유지비수비용추가

async function getIncomeRecords(userId, startDate, endDate) {
  return prisma.income_records.findMany({
    where: {
      driving_logs: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      card_income: true,
      cash_income: true,
      kakao_income: true,
      uber_income: true,
      onda_income: true,
      tada_income: true,
      iam_income: true,
      etc_income: true,
      other_income: true,
      income_spare_1: true,
      income_spare_2: true,
      income_spare_3: true,
      income_spare_4: true,
      total_income: true,
    },
  });
}

async function getExpenseRecords(userId, startDate, endDate) {
  return prisma.expense_records.findMany({
    where: {
      driving_logs: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      fuel_expense: true,
      toll_fee: true,
      meal_expense: true,
      fine_expense: true,
      other_expense: true,
      expense_spare_1: true,
      expense_spare_2: true,
      expense_spare_3: true,
      expense_spare_4: true,
      card_fee: true,
      kakao_fee: true,
      uber_fee: true,
      onda_fee: true,
      tada_fee: true,
      iam_fee: true,
      etc_fee: true,
      total_expense: true,
    },
  });
}
async function getMaintenanceCost(userId, startDate, endDate) {
  const maintenanceRecords = await prisma.maintenance_records.findMany({
    where: {
      userId: userId,
      maintenanceDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    select: {
      maintenanceCost: true,
    },
  });

  return maintenanceRecords.reduce(
    (total, record) => total + (parseFloat(record.maintenanceCost) || 0),
    0
  );
}
async function getInsuranceFeeForYear(userId, year) {
  const cars = await prisma.my_car.findMany({
    where: {
      userId: userId,
      AND: [
        {
          OR: [
            {
              insurance_period_start: {
                lte: new Date(`${year}-12-31`), // 보험 시작이 연도 내에 시작하거나
              },
            },
            {
              insurance_period_end: {
                gte: new Date(`${year}-01-01`), // 보험 종료가 연도 내에 종료하는 경우
              },
            },
          ],
        },
      ],
    },
    select: {
      insurance_fee: true,
      insurance_period_start: true,
      insurance_period_end: true,
    },
  });

  const insuranceTotal = cars.reduce((total, car) => {
    const start = car.insurance_period_start;
    const end = car.insurance_period_end;

    // 연도 내에 보험 기간이 포함되지 않으면 0을 반환
    if (end < new Date(`${year}-01-01`) || start > new Date(`${year}-12-31`)) {
      return total; // 기간 내에 포함되지 않으면 추가하지 않음
    }

    // 전체 보험 기간 동안의 개월 수 계산
    const totalMonths = calculateCoveredMonths(start, end, end.getFullYear());

    // 월 보험료 계산
    const monthlyFee = parseFloat(car.insurance_fee) / totalMonths;

    // 주어진 연도에 해당하는 개월 수 계산
    const monthsCovered = calculateCoveredMonths(start, end, year);

    // 주어진 연도의 보험료 계산
    const annualFeeForCoveredMonths = monthlyFee * monthsCovered;

    return total + annualFeeForCoveredMonths;
  }, 0);

  console.log(`Total insurance fee for year ${year}: ${insuranceTotal}`);

  return insuranceTotal;
}

// 주어진 연도 동안 보험 기간 내 포함된 개월 수 계산
function calculateCoveredMonths(start, end, year) {
  // 시작일과 종료일을 해당 연도로 제한
  const startDate = new Date(
    Math.max(start.getTime(), new Date(`${year}-01-01`).getTime())
  );
  const endDate = new Date(
    Math.min(end.getTime(), new Date(`${year}-12-31`).getTime())
  );

  // 시작일이 종료일보다 늦을 경우 0개월 처리
  if (startDate > endDate) return 0;

  // 포함된 개월 수 계산
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;

  console.log(`Covered months for ${year}: ${months}`);

  return months;
}

async function getEstimatedTotalTax(userId) {
  const userIncome = await prisma.user_incomes.findUnique({
    where: { userId },
    select: {
      estimated_total_tax: true,
    },
  });

  // estimated_total_tax가 null이거나 undefined일 경우 0을 반환하고, 그렇지 않으면 숫자 타입으로 변환
  return userIncome?.estimated_total_tax
    ? Number(userIncome.estimated_total_tax)
    : 0;
}

module.exports = {
  getIncomeDetailsForYear,
  getStandardExpenseRate,
  taxUpdateUserIncome,
  getIncomeRecords,
  getExpenseRecords,
  getMaintenanceCost,
  getInsuranceFeeForYear,
  getEstimatedTotalTax,
};
