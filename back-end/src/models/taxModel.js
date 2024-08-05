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

/**
 * 사용자 ID로 user_incomes 테이블의 standard_expense_rate를 가져오는 함수
 * @param {number} userId - 사용자 ID
 * @returns {Promise<number>} - standard_expense_rate 값
 */
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
    },
  });
}

/**
 * 특정 날짜 범위에 대한 지출 기록을 가져오는 함수
 * @param {number} userId - 사용자 ID
 * @param {string} startDate - 시작 날짜
 * @param {string} endDate - 종료 날짜
 * @returns {Promise<Array>} - 지출 레코드 배열
 */
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
    },
  });
}

module.exports = {
  getIncomeDetailsForYear,
  getStandardExpenseRate,
  taxUpdateUserIncome,
  getIncomeRecords,
  getExpenseRecords,
};
