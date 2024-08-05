import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";

function ProfitLossStatementPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(""); // 월별 조회를 위한 상태
  const [quarter, setQuarter] = useState(""); // 분기별 조회를 위한 상태
  const [viewMode, setViewMode] = useState("year"); // 기본값: 년별
  const [data, setData] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = {
          viewMode,
          month: viewMode === "month" ? month : undefined,
          quarter: viewMode === "quarter" ? quarter : undefined,
        };

        console.log("Sending request with params:", params);

        const response = await api.get(`/tax/profitLossStatementPage/${year}`, {
          params,
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, quarter, viewMode]);

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    setQuarter(""); // 월별로 선택 시 분기 선택 초기화
  };

  const handleQuarterChange = (event) => {
    setQuarter(event.target.value);
    setMonth(""); // 분기로 선택 시 월 선택 초기화
  };

  const handleViewModeChange = (event) => {
    const newViewMode = event.target.value;
    setViewMode(newViewMode);
    if (newViewMode !== "month") {
      setMonth(""); // 월별 보기 형식이 아니면 월을 초기화
    }
    if (newViewMode !== "quarter") {
      setQuarter(""); // 분기별 보기 형식이 아니면 분기를 초기화
    }
  };

  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}원`;
  };

  const calculateProfit = (income, expense) => {
    const totalIncome = income.reduce((sum, item) => {
      return (
        sum +
        Object.values(item).reduce((itemSum, value) => {
          return itemSum + (parseFloat(value) || 0);
        }, 0)
      );
    }, 0);

    const totalExpense = expense.reduce((sum, item) => {
      return (
        sum +
        Object.values(item).reduce((itemSum, value) => {
          return itemSum + (parseFloat(value) || 0);
        }, 0)
      );
    }, 0);

    return totalIncome - totalExpense;
  };

  const calculateNetIncome = (profitBeforeTax, estimatedTax) => {
    return profitBeforeTax - estimatedTax;
  };

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  // 수익과 지출 항목에서 other 항목을 분리
  const filteredIncome = data.income.map((item) => {
    const { other_income, ...rest } = item;
    return { ...rest };
  });

  const filteredExpense = data.expense.map((item) => {
    const { other_expense, ...rest } = item;
    return { ...rest };
  });

  const otherIncomeTotal = data.income.reduce(
    (sum, item) => sum + (parseFloat(item.other_income) || 0),
    0
  );
  const otherExpenseTotal = data.expense.reduce(
    (sum, item) => sum + (parseFloat(item.other_expense) || 0),
    0
  );

  const profitBeforeTax = calculateProfit(filteredIncome, filteredExpense);
  const estimatedTax = 0; // 추후에 예상 종합 소득세를 계산하여 넣을 수 있습니다.
  const netIncome = calculateNetIncome(profitBeforeTax, estimatedTax);

  // 각 수익 항목 및 지출 항목의 기본값을 설정
  const incomeKeys = [
    "card_income",
    "cash_income",
    "kakao_income",
    "uber_income",
    "onda_income",
    "tada_income",
    "iam_income",
    "etc_income",
    "income_spare_1",
    "income_spare_2",
    "income_spare_3",
    "income_spare_4",
  ];

  const expenseKeys = [
    "fuel_expense",
    "toll_fee",
    "meal_expense",
    "fine_expense",
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

  const formatItemName = (key) => {
    const nameMap = {
      card_income: "카드 수익",
      cash_income: "현금 수익",
      kakao_income: "카카오 수익",
      uber_income: "우버 수익",
      onda_income: "온다 수익",
      tada_income: "타다 수익",
      iam_income: "아이엠 수익",
      etc_income: "기타 수익",
      income_spare_1: "기타 수익1",
      income_spare_2: "기타 수익2",
      income_spare_3: "기타 수익3",
      income_spare_4: "기타 수익4",
      fuel_expense: "연료 비용",
      toll_fee: "통행료",
      meal_expense: "식사 비용",
      fine_expense: "벌금",
      expense_spare_1: "기타 비용1",
      expense_spare_2: "기타 비용2",
      expense_spare_3: "기타 비용3",
      expense_spare_4: "기타 비용4",
      card_fee: "카드 수수료",
      kakao_fee: "카카오 수수료",
      uber_fee: "우버 수수료",
      onda_fee: "온다 수수료",
      tada_fee: "타다 수수료",
      iam_fee: "아이엠 수수료",
      etc_fee: "기타 수수료",
    };
    return nameMap[key] || key;
  };

  const defaultIncomeData = incomeKeys.map((key) => ({
    name: formatItemName(key),
    total: 0,
  }));

  const defaultExpenseData = expenseKeys.map((key) => ({
    name: formatItemName(key),
    total: 0,
  }));

  const combinedIncome = filteredIncome.length
    ? filteredIncome.reduce((acc, item) => {
        incomeKeys.forEach((key) => {
          acc[key] = acc[key] || { name: formatItemName(key), total: 0 };
          acc[key].total += parseFloat(item[key]) || 0;
        });
        return acc;
      }, {})
    : defaultIncomeData;

  const combinedExpense = filteredExpense.length
    ? filteredExpense.reduce((acc, item) => {
        expenseKeys.forEach((key) => {
          acc[key] = acc[key] || { name: formatItemName(key), total: 0 };
          acc[key].total += parseFloat(item[key]) || 0;
        });
        return acc;
      }, {})
    : defaultExpenseData;

  return (
    <div className="profitLossContainer">
      <TitleBox title="프리미엄 기능" subtitle="손익계산서" />
      <div className="profitLossContent">
        <div className="filterGroup">
          <label>
            <span>연도 선택</span>
            <select value={year} onChange={handleYearChange}>
              <option value={2018}>2018</option>
              <option value={2019}>2019</option>
              <option value={2020}>2020</option>
              <option value={2021}>2021</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </label>
          <label>
            <span>보기 형식</span>
            <select value={viewMode} onChange={handleViewModeChange}>
              <option value="year">년별</option>
              <option value="month">월별</option>
              <option value="quarter">분기별</option>
            </select>
          </label>
          {viewMode === "month" && (
            <label>
              <span>월 선택</span>
              <select value={month} onChange={handleMonthChange}>
                <option value="">전체</option>
                <option value="1">1월</option>
                <option value="2">2월</option>
                <option value="3">3월</option>
                <option value="4">4월</option>
                <option value="5">5월</option>
                <option value="6">6월</option>
                <option value="7">7월</option>
                <option value="8">8월</option>
                <option value="9">9월</option>
                <option value="10">10월</option>
                <option value="11">11월</option>
                <option value="12">12월</option>
              </select>
            </label>
          )}
          {viewMode === "quarter" && (
            <label>
              <span>분기 선택</span>
              <select value={quarter} onChange={handleQuarterChange}>
                <option value="1">1분기 (1월~3월)</option>
                <option value="2">2분기 (4월~6월)</option>
                <option value="3">3분기 (7월~9월)</option>
                <option value="4">4분기 (10월~12월)</option>
              </select>
            </label>
          )}
        </div>
        <div className="result">
          <div className="section">
            <h3>수익</h3>
            {Object.values(combinedIncome).map((item, index) => (
              <div key={index}>
                <span>기간 내 {item.name}:</span>{" "}
                <span>{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
          <div className="section">
            <h3>지출</h3>
            {Object.values(combinedExpense).map((item, index) => (
              <div key={index}>
                <span>기간 내 {item.name}:</span>{" "}
                <span>{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="otherSection">
          <div className="section">
            <h3>기타 수익</h3>
            <div>
              <span>기타 수익:</span>{" "}
              <span>{formatCurrency(otherIncomeTotal)}</span>
            </div>
          </div>
          <div className="section">
            <h3>기타 지출</h3>
            <div>
              <span>기타 지출:</span>{" "}
              <span>{formatCurrency(otherExpenseTotal)}</span>
            </div>
          </div>
        </div>
        {viewMode === "year" && (
          <div className="summary">
            <div>
              <span>세전 이익:</span>{" "}
              <span>{formatCurrency(profitBeforeTax)}</span>
            </div>
            <div>
              <span>예상 종합 소득세:</span>{" "}
              <span>{formatCurrency(estimatedTax)}</span>
            </div>
            <div>
              <span>당기 순이익:</span> <span>{formatCurrency(netIncome)}</span>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .profitLossContainer {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
        }
        .profitLossContent {
          padding: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .filterGroup {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 20px;
        }
        label {
          display: flex;
          align-items: center;
        }
        label span {
          margin-right: 10px;
          font-weight: bold;
        }
        select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        .result {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .section {
          width: 48%;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        }
        h3 {
          margin-bottom: 20px;
        }
        .section div {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .section div:last-child {
          border-bottom: none;
        }
        .otherSection {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .summary {
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          margin-top: 30px;
        }
        .summary div {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .summary div:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}

export default ProfitLossStatementPage;
