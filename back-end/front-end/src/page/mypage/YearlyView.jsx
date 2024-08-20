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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       console.log("Fetching yearly data for:", year);

  //       const response = await api.get(
  //         `/tax/profitLossStatement/yearly/${year}`
  //       );
  //       setData(response.data);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //       setError("데이터를 가져오는 중 오류가 발생했습니다.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [year]);

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
                  <span>{formatCurrency(operatingIncome)}</span>
                </div>
              </div>
              <div className="column">
                <h4>기타 수익/지출</h4>
                <div>
                  <span>기타 수익</span>{" "}
                  <span>{formatCurrency(data.income.other_income || 0)}</span>
                </div>
                <div>
                  <span>기타 지출</span>{" "}
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
      <style jsx>{`
        .yearlyView {
          padding: 50px;
          @media (max-width: 768px) {
            padding: 15px;
          }
          h3 {
            text-align: center;
            width: 100%;
            font-weight: 700;
            font-size: 22px;
            color: #333;
            margin: 30px 0 20px 0;
            @media (max-width: 1024px) {
              font-size: 20px;
              margin: 15px 0 10px 0;
            }
          }
          .titleFitler {
            position: relative;
            margin-bottom: 60px;
            @media (max-width: 1024px) {
              margin-bottom: 20px;
            }
            .filterGroup {
              position: absolute;
              right: 0;
              top: 0%;
              height: 100%;
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              gap: 10px;
              @media (max-width: 768px) {
                position: static;
                width: 100%;
              }
              label {
                display: flex;
                align-items: center;
                @media (max-width: 768px) {
                  width: 100%;
                  justify-content: center;
                }
                span {
                  margin-right: 10px;
                  font-weight: 600;
                  color: #444;
                  font-size: 15px;
                }
              }
              select {
                padding: 5px 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                font-size: 16px;
                transition: border-color 0.3s;
                color: #444;
                cursor: pointer;
              }
            }
          }

          .result {
            display: flex;
            flex-direction: column;
            margin-bottom: 30px;
            h4 {
              width: 100%;
              padding: 10px 0;
              color: #222;
              font-weight: 600;
              font-size: 15px;
              margin-bottom: 10px;
            }
            .section {
              background-color: #ffffff;
            }
            .section.summarySection {
              margin-top: 30px;
              background-color: #05aced;
              padding: 1% 5% 5% 5%;
              border-radius: 10px;

              h3,
              h4 {
                color: white;
              }
              h3 {
                font-size: 25px;
              }
              h4 {
                margin: 0;
              }
              .column {
                margin-bottom: 20px;
                div {
                  font-size: 14px;
                  line-height: 30px;
                  margin: 0;
                  &:not(:last-of-type) {
                    border-bottom: 1px solid #d9d9d9;
                  }
                  &:first-of-type {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                  }
                  &:last-of-type {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                  }
                }
              }
            }
            .row {
              display: flex;
              justify-content: space-between;
              @media (max-width: 768px) {
                flex-wrap: wrap;
              }
            }
            .column {
              width: 48%;
              @media (max-width: 768px) {
                width: 100%;
              }
            }
            .column div {
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              padding: 5px 10px;
              font-size: 14px;
              font-weight: 500;
              background-color: #f4f4f4;
              &.total {
                justify-content: flex-end;
                gap: 20px;
                background-color: transparent;
                font-weight: bold;
                margin-top: 10px;
              }
            }

            .divider {
              height: 1px;
              background-color: #000;
              margin: 20px 0;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default YearlyView;
