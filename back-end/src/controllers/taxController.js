// /src/controllers/taxController.js

const {
  getIncomeDetailsForYear,
  taxUpdateUserIncome,
  getIncomeRecords,
  getExpenseRecords,
  getMaintenanceCost,
  getInsuranceFeeForYear,
  getEstimatedTotalTax,
} = require("../models/taxModel");

async function getEstimatedIncomeTaxPage(req, res) {
  try {
    const year = parseInt(req.params.year, 10);
    const { userId } = req; // authMiddleware를 통해 설정된 사용자 ID

    if (isNaN(year)) {
      return res.status(400).json({ error: "올바른 연도를 제공해야 합니다." });
    }

    const { totalIncome, standardExpenseRate, personalDeduction } =
      await getIncomeDetailsForYear(year, userId);

    res.json({ year, totalIncome, standardExpenseRate, personalDeduction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

async function updateUserIncome(req, res) {
  try {
    const { year, personalDeduction, estimatedTotalTax } = req.body;
    const { userId } = req;

    await taxUpdateUserIncome(
      userId,
      year,
      personalDeduction,
      estimatedTotalTax
    );

    res
      .status(200)
      .json({ message: "소득 정보가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error:
        error.message || "소득 정보를 업데이트하는 중 오류가 발생했습니다.",
    });
  }
}

// 손익
async function getYearlyProfitLoss(req, res) {
  try {
    const { year } = req.params;
    const { userId } = req;

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const incomeRecords = await getIncomeRecords(userId, startDate, endDate);
    const expenseRecords = await getExpenseRecords(userId, startDate, endDate);

    // estimated_total_tax 가져오기

    const estimatedTotalTax = await getEstimatedTotalTax(userId);

    // 유지보수 비용 합계 가져오기
    const maintenanceCost = await getMaintenanceCost(
      userId,
      startDate,
      endDate
    );

    // 보험료 합계 계산
    const insuranceFee = await getInsuranceFeeForYear(userId, year);

    const incomeTotal = calculateTotals(incomeRecords, "income");
    const expenseTotal = calculateTotals(expenseRecords, "expense");

    // 보험료 및 유지보수 비용을 포함하여 응답 반환
    res.json({
      income: incomeTotal,
      expense: expenseTotal,
      maintenanceCost,
      insuranceFee, // 보험료 추가
      estimatedTotalTax,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "연도별 손익계산서 생성 중 오류가 발생했습니다." });
  }
}

// 각 레코드의 항목별 합계를 계산하는 함수
function calculateTotals(records, type) {
  const incomeFields = [
    "card_income",
    "cash_income",
    "kakao_income",
    "uber_income",
    "onda_income",
    "tada_income",
    "iam_income",
    "etc_income",
    "other_income",
    "income_spare_1",
    "income_spare_2",
    "income_spare_3",
    "income_spare_4",
  ];

  const expenseFields = [
    "fuel_expense",
    "toll_fee",
    "meal_expense",
    "fine_expense",
    "other_expense",
    "expense_spare_1",
    "expense_spare_2",
    "expense_spare_3",
    "expense_spare_4",
    "card_fee",
    "kakao_fee",
    "uber_fee",
    "onda_fee",
    "tada_fee",
    "iam_fee",
    "etc_fee",
  ];

  const totals = {};

  const fields = type === "income" ? incomeFields : expenseFields;

  // 모든 항목을 0으로 초기화
  fields.forEach((field) => {
    totals[field] = 0;
  });

  // 각 항목의 값을 합산
  records.forEach((record) => {
    for (const [key, value] of Object.entries(record)) {
      totals[key] += parseFloat(value) || 0;
    }
  });

  return totals;
}

// 월별 손익계산서 조회
async function getMonthlyProfitLoss(req, res) {
  try {
    const { startYear, startMonth, endYear, endMonth } = req.query;
    const { userId } = req;

    const incomeData = [];
    const expenseData = [];

    const totalIncome = {};
    const totalExpense = {};

    let currentYear = parseInt(startYear, 10);
    let currentMonth = parseInt(startMonth, 10);

    while (
      currentYear < parseInt(endYear, 10) ||
      (currentYear === parseInt(endYear, 10) &&
        currentMonth <= parseInt(endMonth, 10))
    ) {
      const startDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}-01`;
      const endDate = new Date(currentYear, currentMonth, 0)
        .toISOString()
        .split("T")[0];

      const incomeRecords = await getIncomeRecords(userId, startDate, endDate);
      const expenseRecords = await getExpenseRecords(
        userId,
        startDate,
        endDate
      );

      const incomeTotal = calculateTotals(incomeRecords, "income");
      const expenseTotal = calculateTotals(expenseRecords, "expense");

      // Get maintenance cost and insurance fee for each month
      const maintenanceCost = await getMaintenanceCost(
        userId,
        startDate,
        endDate
      );
      const insuranceFee = await getInsuranceFeeForYear(userId, currentYear);

      // Add maintenance cost and insurance fee to expenses
      expenseTotal.maintenanceCost = maintenanceCost;
      expenseTotal.insuranceFee = insuranceFee / 12; // Monthly insurance fee

      incomeData.push(incomeTotal);
      expenseData.push(expenseTotal);

      // Add to total income and expense
      for (const [key, value] of Object.entries(incomeTotal)) {
        totalIncome[key] = (totalIncome[key] || 0) + value;
      }
      for (const [key, value] of Object.entries(expenseTotal)) {
        totalExpense[key] = (totalExpense[key] || 0) + value;
      }

      // Move to next month
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }

    // Get estimated total tax
    const estimatedTotalTax = await getEstimatedTotalTax(userId);

    // Add total insurance and tax to total expense
    totalExpense.insuranceFee =
      (totalExpense.insuranceFee || 0) +
      (getInsuranceFeeForYear(userId, startYear) / 12) *
        ((endYear - startYear) * 12 + endMonth - startMonth + 1);
    totalExpense.estimatedTotalTax = estimatedTotalTax;

    res.json({
      income: incomeData,
      expense: expenseData,
      totalIncome,
      totalExpense,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "월별 손익계산서 생성 중 오류가 발생했습니다." });
  }
}

// 분기별 손익계산서 조회
async function getQuarterlyProfitLoss(req, res) {
  try {
    const { year, quarter } = req.params;
    const { userId } = req;

    const { incomeTotal, expenseTotal } = await calculateQuarterlyTotals(
      userId,
      year,
      quarter
    );

    res.json({ income: incomeTotal, expense: expenseTotal });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "분기별 손익계산서 생성 중 오류가 발생했습니다." });
  }
}

// 월별 수익 및 지출 합계 계산 함수
async function calculateMonthlyTotals(userId, year, month) {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  console.log(`Calculating for range: ${startDate} to ${endDate}`);

  const incomeRecords = await getIncomeRecords(userId, startDate, endDate);
  const incomeTotal = calculateTotals(incomeRecords);

  const expenseRecords = await getExpenseRecords(userId, startDate, endDate);
  const expenseTotal = calculateTotals(expenseRecords);

  return { incomeTotal, expenseTotal };
}

// 분기별 수익 및 지출 합계 계산 함수
async function calculateQuarterlyTotals(userId, year, quarter) {
  const quarters = {
    1: [1, 3], // 1월~3월
    2: [4, 6], // 4월~6월
    3: [7, 9], // 7월~9월
    4: [10, 12], // 10월~12월
  };

  const [startMonth, endMonth] = quarters[quarter];
  let incomeTotal = {};
  let expenseTotal = {};

  for (let month = startMonth; month <= endMonth; month++) {
    const { incomeTotal: monthIncomeTotal, expenseTotal: monthExpenseTotal } =
      await calculateMonthlyTotals(userId, year, month);

    incomeTotal = addTotals(incomeTotal, monthIncomeTotal);
    expenseTotal = addTotals(expenseTotal, monthExpenseTotal);
  }

  return { incomeTotal, expenseTotal };
}

// 두 개의 합계 객체를 합산하는 함수
function addTotals(totals1, totals2) {
  const result = { ...totals1 };
  for (const [key, value] of Object.entries(totals2)) {
    result[key] = (result[key] || 0) + value;
  }
  return result;
}

// 각 레코드의 항목별 합계를 계산하는 함수
function calculateTotals(records) {
  const totals = {};

  records.forEach((record) => {
    for (const [key, value] of Object.entries(record)) {
      if (!totals[key]) {
        totals[key] = 0;
      }
      totals[key] += parseFloat(value) || 0;
    }
  });

  return totals;
}

module.exports = {
  getEstimatedIncomeTaxPage,
  updateUserIncome,
  getYearlyProfitLoss,
  getMonthlyProfitLoss,
  getQuarterlyProfitLoss,
};
