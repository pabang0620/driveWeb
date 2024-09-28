// YearlyView.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import "./mypage.scss";

function YearlyView() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({
    income: {},
    expense: {},
    maintenanceCost: 0,
    insuranceFee: 0,
    estimatedTotalTax: 0,
    previousIncomeTotal: {},
    previousExpenseTotal: {},
  });

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

        console.log("Fetching yearly data for:", year);

        const response = await api.get(
          `/tax/profitLossStatement/yearly/${year}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  // 한국어로 항목 이름 매핑
  const incomeLabels = {
    card_income: "카드 수입",
    cash_income: "현금 수입",
    kakao_income: "카카오 수입",
    uber_income: "우버 수입",
    // onda_income: "온다 수입",
    // tada_income: "타다 수입",
    // iam_income: "아이엠 수입",
    etc_income: "기타 수입",
    income_spare_1: "예비 수입 1",
    income_spare_2: "예비 수입 2",
    income_spare_3: "예비 수입 3",
    income_spare_4: "예비 수입 4",
  };

  const expenseLabels = {
    fuel_expense: "연료비",
    toll_fee: "통행료",
    meal_expense: "식비",
    fine_expense: "벌금",
    expense_spare_1: "예비 지출 1",
    expense_spare_2: "예비 지출 2",
    expense_spare_3: "예비 지출 3",
    expense_spare_4: "예비 지출 4",
    card_fee: "카드 수수료",
    kakao_fee: "카카오 수수료",
    uber_fee: "우버 수수료",
    // onda_fee: "온다 수수료",
    // tada_fee: "타다 수수료",
    // iam_fee: "아이엠 수수료",
    etc_fee: "기타 수수료",
  };

  // 수입의 총합 계산
  const totalIncome = Object.entries(data.income)
    .filter(([key]) => key !== "other_income")
    .reduce((sum, [, value]) => sum + (parseFloat(value) || 0), 0);

  // 지출의 총합 계산
  const totalExpense =
    Object.entries(data.expense)
      .filter(([key]) => key !== "other_expense")
      .reduce((sum, [, value]) => sum + (parseFloat(value) || 0), 0) +
    data.maintenanceCost +
    data.insuranceFee;

  // 영업이익 계산
  const calculateOperatingIncome = () => totalIncome - totalExpense;
  // 작년 영업 이익 계산
  const prevCalculateOperatingIncome = () =>
    data.previousIncomeTotal.total_income -
    data.previousExpenseTotal.total_expense;

  // 세전이익 계산
  const calculatePreTaxIncome = (operatingIncome) => {
    const otherIncome = parseFloat(data.income.other_income) || 0;
    const otherExpense = parseFloat(data.expense.other_expense) || 0;

    return operatingIncome + otherIncome - otherExpense;
  };

  // 당기순이익 계산
  const calculateNetIncome = (preTaxIncome) => {
    const estimatedTax = Number(data.estimatedTotalTax) || 0;
    return estimatedTax;
  };

  const operatingIncome = calculateOperatingIncome();
  const preTaxIncome = calculatePreTaxIncome(operatingIncome);
  const netIncome = calculateNetIncome(preTaxIncome);

  // 작년 영업 이익
  const prevOperatingIncome = prevCalculateOperatingIncome();
  // 작년 기타 수익
  const previosIncome = data.previousIncomeTotal.other_income;
  // 작년 기타 지출
  const previousExpense = data.previousExpenseTotal.other_expense;

  const calculateNet = operatingIncome - prevOperatingIncome;
  const calculateIncome = data.income.other_income - previosIncome;
  const calculateExpense = data.expense.other_expense - previousExpense;
  console.log(calculateNet, calculateIncome, calculateExpense);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 2018; y <= currentYear; y++) {
    years.push(y);
  }

  const formatCurrency = (value) => {
    return `${Math.floor(value).toLocaleString()}원`; // 소수점 제거
  };

  // if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="yearlyView">
      <div className="titleFitler">
        <h3>연도별 수익 및 지출 합계</h3>
        <div className="filterGroup">
          <label>
            <span>연도 선택</span>
            <select value={year} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="result">
        <div className="section">
          <div className="row">
            <div className="column">
              <h4>수익</h4>
              {Object.entries(incomeLabels).map(([key, label]) => (
                <div key={key}>
                  <span>{label}</span>{" "}
                  <span>{formatCurrency(data.income[key] || 0)}</span>
                </div>
              ))}
              <div className="total">
                <span>총 수익</span> <span>{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            <div className="column">
              <h4>지출</h4>
              {Object.entries(expenseLabels).map(([key, label]) => (
                <div key={key}>
                  <span>{label}</span>{" "}
                  <span>{formatCurrency(data.expense[key] || 0)}</span>
                </div>
              ))}
              <div>
                <span>유지보수 비용</span>{" "}
                <span>{formatCurrency(data.maintenanceCost)}</span>
              </div>
              <div>
                <span>보험료</span>{" "}
                <span>{formatCurrency(data.insuranceFee)}</span>
              </div>
              <div className="total">
                <span>총 지출</span> <span>{formatCurrency(totalExpense)}</span>
              </div>
            </div>
          </div>
          <div className="section summarySection">
            <h3>손익 요약</h3>
            <div className="row">
              <div className="column">
                <h4>영업 이익</h4>
                <div>
                  <span>영업 이익</span>{" "}
                  <span
                    style={{
                      color: calculateNet < 0 ? "blue" : "red",
                      marginRight: "-40%",
                    }}
                  >
                    {formatCurrency(calculateNet)}
                  </span>
                  <span>{formatCurrency(operatingIncome)}</span>
                </div>
              </div>
              <div className="column">
                <h4>기타 수익/지출</h4>
                <div>
                  <span>기타 수익</span>{" "}
                  <span
                    style={{
                      color: calculateIncome < 0 ? "blue" : "red",
                      marginRight: "-40%",
                    }}
                  ></span>
                  <span>{formatCurrency(data.income.other_income || 0)}</span>
                </div>
                <div>
                  <span>기타 지출</span>{" "}
                  <span
                    style={{
                      color: calculateExpense < 0 ? "blue" : "red",
                      marginRight: "-40%",
                    }}
                  ></span>
                  <span>{formatCurrency(data.expense.other_expense || 0)}</span>
                </div>
              </div>
            </div>
            {/* <div className="divider"></div> 구분선 추가 */}
            <div className="row">
              <div className="column">
                <h4>세전 이익</h4>
                <div>
                  <span>세전 이익</span>{" "}
                  <span>{formatCurrency(preTaxIncome)}</span>
                </div>
              </div>
              <div className="column">
                <h4>당기 순이익</h4>
                <div>
                  <span>당기 순이익</span>{" "}
                  <span>{formatCurrency(netIncome)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YearlyView;
