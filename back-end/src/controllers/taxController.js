// /src/controllers/taxController.js

const {
  getIncomeDetailsForYear,
  taxUpdateUserIncome,
  getIncomeRecords,
  getExpenseRecords,
} = require("../models/taxModel");

/**
 * 주어진 연도의 총 소득과 표준 경비율을 응답하는 컨트롤러
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 */
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
async function getProfitLossStatementPage(req, res) {
  try {
    const { year } = req.params;
    const { month, viewMode, quarter } = req.query;
    const { userId } = req; // authMiddleware를 통해 설정된 사용자 ID

    console.log("Received year:", year);
    console.log("Received month:", month);
    console.log("Received viewMode:", viewMode);
    console.log("Received quarter:", quarter);

    // 날짜 범위 계산
    const dateRanges = getDateRanges(year, month, viewMode, quarter);

    const incomeTotals = [];
    const expenseTotals = [];

    // 각 날짜 범위에 대한 수익 및 지출 계산
    for (const range of dateRanges) {
      const [startDate, endDate] = range;

      console.log(`Calculating for range: ${startDate} to ${endDate}`);

      // 수익 항목 합계 계산
      const incomeRecords = await getIncomeRecords(userId, startDate, endDate);
      const incomeTotal = calculateTotals(incomeRecords);
      incomeTotals.push(incomeTotal);

      // 지출 항목 합계 계산
      const expenseRecords = await getExpenseRecords(
        userId,
        startDate,
        endDate
      );
      const expenseTotal = calculateTotals(expenseRecords);
      expenseTotals.push(expenseTotal);
    }

    res.json({ income: incomeTotals, expense: expenseTotals });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "손익계산서를 생성하는 중 오류가 발생했습니다." });
  }
}

/**
 * 각 레코드의 항목별 합계를 계산하는 함수
 * @param {Array} records - 계산할 레코드 배열
 * @returns {Object} - 합계 객체
 */
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

function getDateRanges(year, month, viewMode, quarter) {
  const ranges = [];

  if (month) {
    // 특정 월이 제공된 경우 해당 월의 전체 기간을 반환
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0];
    ranges.push([start, end]);
  } else {
    // 월이 제공되지 않은 경우 보기 모드에 따라 날짜 범위 설정
    switch (viewMode) {
      case "year":
        ranges.push([`${year}-01-01`, `${year}-12-31`]);
        break;
      case "quarter":
        if (!quarter || quarter === null || quarter === "") {
          quarter = "1";
        }
        switch (quarter) {
          case "1":
            ranges.push([`${year}-01-01`, `${year}-03-31`]);
            break;
          case "2":
            ranges.push([`${year}-04-01`, `${year}-06-30`]);
            break;
          case "3":
            ranges.push([`${year}-07-01`, `${year}-09-30`]);
            break;
          case "4":
            ranges.push([`${year}-10-01`, `${year}-12-31`]);
            break;
          default:
            throw new Error("올바르지 않은 분기입니다.");
        }
        break;
      default:
        throw new Error("올바르지 않은 보기 모드입니다.");
    }
  }

  return ranges;
}

module.exports = {
  getEstimatedIncomeTaxPage,
  updateUserIncome,
  getProfitLossStatementPage,
};
