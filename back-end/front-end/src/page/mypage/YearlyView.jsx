// YearlyView.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";

function YearlyView() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({
    income: {},
    expense: {},
    maintenanceCost: 0,
    insuranceFee: 0,
    estimatedTotalTax: 0,
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

  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}원`;
  };

  // 한국어로 항목 이름 매핑
  const incomeLabels = {
    card_income: "카드 수입",
    cash_income: "현금 수입",
    kakao_income: "카카오 수입",
    uber_income: "우버 수입",
    onda_income: "온다 수입",
    tada_income: "타다 수입",
    iam_income: "아이엠 수입",
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
    onda_fee: "온다 수수료",
    tada_fee: "타다 수수료",
    iam_fee: "아이엠 수수료",
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

  // 세전이익 계산
  const calculatePreTaxIncome = (operatingIncome) => {
    const otherIncome = parseFloat(data.income.other_income) || 0;
    const otherExpense = parseFloat(data.expense.other_expense) || 0;

    return operatingIncome + otherIncome - otherExpense;
  };

  // 당기순이익 계산
  const calculateNetIncome = (preTaxIncome) => {
    const estimatedTax = parseFloat(data.estimatedTotalTax) || 0;
    return preTaxIncome - estimatedTax;
  };

  const operatingIncome = calculateOperatingIncome();
  const preTaxIncome = calculatePreTaxIncome(operatingIncome);
  const netIncome = calculateNetIncome(preTaxIncome);

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="yearlyView">
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
      </div>
      <div className="result">
        <div className="section">
          <h3>연도별 수익 및 지출 합계</h3>
          <div className="row">
            <div className="column">
              <h4>수익</h4>
              {Object.entries(incomeLabels).map(([key, label]) => (
                <div key={key}>
                  <span>{label}:</span>{" "}
                  <span>{formatCurrency(data.income[key] || 0)}</span>
                </div>
              ))}
              <div className="total">
                <span>총 수익:</span> <span>{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            <div className="column">
              <h4>지출</h4>
              {Object.entries(expenseLabels).map(([key, label]) => (
                <div key={key}>
                  <span>{label}:</span>{" "}
                  <span>{formatCurrency(data.expense[key] || 0)}</span>
                </div>
              ))}
              <div>
                <span>유지보수 비용:</span>{" "}
                <span>{formatCurrency(data.maintenanceCost)}</span>
              </div>
              <div>
                <span>보험료:</span>{" "}
                <span>{formatCurrency(data.insuranceFee)}</span>
              </div>
              <div className="total">
                <span>총 지출:</span>{" "}
                <span>{formatCurrency(totalExpense)}</span>
              </div>
            </div>
          </div>
          <div className="divider"></div> {/* 구분선 추가 */}
          <div className="section">
            <h3>이익 요약</h3>
            <div className="row">
              <div className="column">
                <h4>영업 이익</h4>
                <div>
                  <span>영업 이익:</span>{" "}
                  <span>{formatCurrency(operatingIncome)}</span>
                </div>
              </div>
              <div className="column">
                <h4>기타 수익/지출</h4>
                <div>
                  <span>기타 수익:</span>{" "}
                  <span>{formatCurrency(data.income.other_income || 0)}</span>
                </div>
                <div>
                  <span>기타 지출:</span>{" "}
                  <span>{formatCurrency(data.expense.other_expense || 0)}</span>
                </div>
              </div>
            </div>
            <div className="divider"></div> {/* 구분선 추가 */}
            <div className="row">
              <div className="column">
                <h4>세전 이익</h4>
                <div>
                  <span>세전 이익:</span>{" "}
                  <span>{formatCurrency(preTaxIncome)}</span>
                </div>
              </div>
              <div className="column">
                <h4>당기 순이익</h4>
                <div>
                  <span>당기 순이익:</span>{" "}
                  <span>{formatCurrency(netIncome)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .yearlyView {
          padding: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          h3,
          h4 {
            margin: 10px 0px;
          }
          .filterGroup {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 10px;
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
            flex-direction: column;
            margin-bottom: 30px;
          }
          .section {
            border-radius: 4px;
            background-color: #ffffff;
            margin-bottom: 20px;
          }
          .row {
            display: flex;
            justify-content: space-between;
          }
          .column {
            width: 48%;
          }
          .column div {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .column div:last-child {
            border-bottom: none;
          }
          .total {
            font-weight: bold;
            margin-top: 10px;
          }
          .divider {
            height: 1px;
            background-color: #000;
            margin: 20px 0;
          }
        }
      `}</style>
    </div>
  );
}

export default YearlyView;
