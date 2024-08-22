import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { dummymonthlyData } from "../../components/dummy";
// 한국어 로케일 등록
registerLocale("ko", ko);
setDefaultLocale("ko");

function MonthlyView() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState({
    income: [],
    expense: [],
    totalIncome: {
      card_income: 0,
      cash_income: 0,
      kakao_income: 0,
      uber_income: 0,
      onda_income: 0,
      tada_income: 0,
      iam_income: 0,
      other_income: 0,
    },
    totalExpense: {
      fuel_expense: 0,
      toll_fee: 0,
      meal_expense: 0,
      fine_expense: 0,
      expense_spare_1: 0,
      expense_spare_2: 0,
      card_fee: 0,
      maintenanceCost: 0,
      insuranceFee: 0,
      other_expense: 0,
      estimatedTotalTax: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (monthlyData.income.length > 0) {
      console.log("Updated monthly data:", monthlyData);
    }
  }, [monthlyData]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;

      console.log(
        "Fetching monthly data for:",
        startYear,
        startMonth,
        endYear,
        endMonth
      );

      const response = await api.get(`/tax/profitLossStatement/monthly`, {
        params: {
          startYear,
          startMonth,
          endYear,
          endMonth,
        },
      });
      const data = response.data;

      setMonthlyData({
        income: data.income || [],
        expense: data.expense || [],
        totalIncome: {
          ...monthlyData.totalIncome,
          ...data.totalIncome,
        },
        totalExpense: {
          ...monthlyData.totalExpense,
          ...data.totalExpense,
          estimatedTotalTax:
            parseFloat(data.totalExpense.estimatedTotalTax) || 0, // 타입 확인
        },
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleFetchData = () => {
    fetchData();
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
  };

  const expenseLabels = {
    fuel_expense: "연료비",
    toll_fee: "통행료",
    meal_expense: "식비",
    fine_expense: "벌금",
    expense_spare_1: "예비 지출 1",
    expense_spare_2: "예비 지출 2",
    card_fee: "카드 수수료",
    maintenanceCost: "유지보수 비용",
    insuranceFee: "보험료",
  };

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="monthlyView">
      <div className="titleFitler">
        <h3>월별 수익 및 지출 합계</h3>
        <div className="filterGroup">
          <label>
            <span>시작 월</span>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy년 MM월"
              showMonthYearPicker
              locale="ko"
              className="datePicker"
            />
          </label>
          <label>
            <span>종료 월</span>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy년 MM월"
              showMonthYearPicker
              locale="ko"
              className="datePicker"
            />
          </label>
          <button onClick={handleFetchData} className="fetchButton">
            조회
          </button>
        </div>
      </div>

      <div className="result">
        {monthlyData.income.length === 0 && (
          <div className="noDataMessage">
            기간을 설정하고 조회를 눌러주세요.
          </div>
        )}
        {monthlyData.income.length > 0 && (
          <>
            <div className="section">
              <div className="row">
                <div className="column item_categorys">
                  <h4 className="opacity">항목</h4>
                  <div className="income">
                    {Object.keys(incomeLabels).map((key) => (
                      <div key={key}>
                        <span>{incomeLabels[key]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="expense">
                    {Object.keys(expenseLabels).map((key) => (
                      <div key={key}>
                        <span>{expenseLabels[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="column">
                  <h4>기간 내 합계</h4>
                  <div className="income">
                    {Object.keys(incomeLabels).map((key) => (
                      <div key={key}>
                        <span
                          style={{
                            color:
                              monthlyData.totalIncome[key] > 0
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {formatCurrency(monthlyData.totalIncome[key] || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="expense">
                    {Object.keys(expenseLabels).map((key) => (
                      <div key={key}>
                        <span
                          style={{
                            color:
                              monthlyData.totalExpense[key] > 0
                                ? "blue"
                                : "inherit",
                          }}
                        >
                          {formatCurrency(monthlyData.totalExpense[key] || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {monthlyData.income.map((income, index) => (
                  <>
                    <div className="column moblie item_categorys">
                      <h4 className="opacity">항목</h4>
                      <div className="income">
                        {Object.keys(incomeLabels).map((key) => (
                          <div key={key}>
                            <span>{incomeLabels[key]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="expense">
                        {Object.keys(expenseLabels).map((key) => (
                          <div key={key}>
                            <span>{expenseLabels[key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="column" key={index}>
                      <h4>{`${startDate.getFullYear()}년 ${
                        startDate.getMonth() + index + 1
                      }월`}</h4>
                      <div className="income">
                        {Object.keys(incomeLabels).map((key) => (
                          <div key={key}>
                            <span
                              style={{
                                color: income[key] > 0 ? "red" : "inherit",
                              }}
                            >
                              {formatCurrency(income[key] || 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="expense">
                        {Object.keys(expenseLabels).map((key) => (
                          <div key={key}>
                            <span
                              style={{
                                color:
                                  monthlyData.expense[index][key] > 0
                                    ? "blue"
                                    : "inherit",
                              }}
                            >
                              {formatCurrency(
                                monthlyData.expense[index][key] || 0
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>

            <div className="section summarySection">
              <h3>손익 요약</h3>
              <div className="row">
                <div className="column item_categorys">
                  <h4 className="opacity">항목</h4>
                  <div>
                    <span>영업이익</span>
                  </div>
                  <div>
                    <span>영업외 수익</span>
                  </div>
                  <div>
                    <span>영업외 지출</span>
                  </div>
                  <div>
                    <span>세전 이익</span>
                  </div>
                  <div>
                    <span>당기 순이익</span>
                  </div>
                </div>
                <div className="column">
                  <h4>기간 내 합계</h4>
                  <div>
                    <span
                      style={{
                        color:
                          Object.values(monthlyData.totalIncome).reduce(
                            (a, b) => a + b,
                            0
                          ) -
                            Object.values(monthlyData.totalExpense).reduce(
                              (a, b) => a + b,
                              0
                            ) >
                          0
                            ? "red"
                            : "blue",
                      }}
                    >
                      {formatCurrency(
                        Object.values(monthlyData.totalIncome).reduce(
                          (a, b) => a + b,
                          0
                        ) -
                          Object.values(monthlyData.totalExpense).reduce(
                            (a, b) => a + b,
                            0
                          )
                      )}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color:
                          monthlyData.totalIncome.other_income > 0
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {formatCurrency(
                        monthlyData.totalIncome.other_income || 0
                      )}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color:
                          monthlyData.totalExpense.other_expense > 0
                            ? "blue"
                            : "inherit",
                      }}
                    >
                      {formatCurrency(
                        monthlyData.totalExpense.other_expense || 0
                      )}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color:
                          Object.values(monthlyData.totalIncome).reduce(
                            (a, b) => a + b,
                            0
                          ) +
                            (monthlyData.totalIncome.other_income || 0) -
                            (monthlyData.totalExpense.other_expense || 0) -
                            Object.values(monthlyData.totalExpense).reduce(
                              (a, b) => a + b,
                              0
                            ) >
                          0
                            ? "red"
                            : "blue",
                      }}
                    >
                      {formatCurrency(
                        Object.values(monthlyData.totalIncome).reduce(
                          (a, b) => a + b,
                          0
                        ) +
                          (monthlyData.totalIncome.other_income || 0) -
                          (monthlyData.totalExpense.other_expense || 0) -
                          Object.values(monthlyData.totalExpense).reduce(
                            (a, b) => a + b,
                            0
                          )
                      )}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color:
                          Object.values(monthlyData.totalIncome).reduce(
                            (a, b) => a + b,
                            0
                          ) +
                            (monthlyData.totalIncome.other_income || 0) -
                            (monthlyData.totalExpense.other_expense || 0) -
                            Object.values(monthlyData.totalExpense).reduce(
                              (a, b) => a + b,
                              0
                            ) -
                            monthlyData.totalExpense.estimatedTotalTax >
                          0
                            ? "red"
                            : "blue",
                      }}
                    >
                      {formatCurrency(
                        Object.values(monthlyData.totalIncome).reduce(
                          (a, b) => a + b,
                          0
                        ) +
                          (monthlyData.totalIncome.other_income || 0) -
                          (monthlyData.totalExpense.other_expense || 0) -
                          Object.values(monthlyData.totalExpense).reduce(
                            (a, b) => a + b,
                            0
                          ) -
                          monthlyData.totalExpense.estimatedTotalTax
                      )}
                    </span>
                  </div>
                </div>
                {monthlyData.income.map((income, index) => (
                  <>
                    <div className="column moblie item_category">
                      <h4 className="opacity">항목</h4>
                      <div>
                        <span>영업이익</span>
                      </div>
                      <div>
                        <span>영업외 수익</span>
                      </div>
                      <div>
                        <span>영업외 지출</span>
                      </div>
                      <div>
                        <span>세전 이익</span>
                      </div>
                      <div>
                        <span>당기 순이익</span>
                      </div>
                    </div>
                    <div className="column" key={index}>
                      <h4>{`${startDate.getFullYear()}년 ${
                        startDate.getMonth() + index + 1
                      }월`}</h4>
                      <div>
                        <span
                          style={{
                            color:
                              Object.values(income).reduce((a, b) => a + b, 0) -
                                Object.values(
                                  monthlyData.expense[index]
                                ).reduce((a, b) => a + b, 0) >
                              0
                                ? "red"
                                : "blue",
                          }}
                        >
                          {formatCurrency(
                            Object.values(income).reduce((a, b) => a + b, 0) -
                              Object.values(monthlyData.expense[index]).reduce(
                                (a, b) => a + b,
                                0
                              )
                          )}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color: income.other_income > 0 ? "red" : "inherit",
                          }}
                        >
                          {formatCurrency(income.other_income || 0)}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color:
                              monthlyData.expense[index].other_expense > 0
                                ? "blue"
                                : "inherit",
                          }}
                        >
                          {formatCurrency(
                            monthlyData.expense[index].other_expense || 0
                          )}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color:
                              Object.values(income).reduce((a, b) => a + b, 0) +
                                (income.other_income || 0) -
                                (monthlyData.expense[index].other_expense ||
                                  0) -
                                Object.values(
                                  monthlyData.expense[index]
                                ).reduce((a, b) => a + b, 0) >
                              0
                                ? "red"
                                : "blue",
                          }}
                        >
                          {formatCurrency(
                            Object.values(income).reduce((a, b) => a + b, 0) +
                              (income.other_income || 0) -
                              (monthlyData.expense[index].other_expense || 0) -
                              Object.values(monthlyData.expense[index]).reduce(
                                (a, b) => a + b,
                                0
                              )
                          )}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color:
                              Object.values(income).reduce((a, b) => a + b, 0) +
                                (income.other_income || 0) -
                                (monthlyData.expense[index].other_expense ||
                                  0) -
                                Object.values(
                                  monthlyData.expense[index]
                                ).reduce((a, b) => a + b, 0) -
                                monthlyData.totalExpense.estimatedTotalTax >
                              0
                                ? "red"
                                : "blue",
                          }}
                        >
                          {formatCurrency(
                            Object.values(income).reduce((a, b) => a + b, 0) +
                              (income.other_income || 0) -
                              (monthlyData.expense[index].other_expense || 0) -
                              Object.values(monthlyData.expense[index]).reduce(
                                (a, b) => a + b,
                                0
                              ) -
                              monthlyData.totalExpense.estimatedTotalTax / 12
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .monthlyView {
          padding: 50px;
          @media (max-width: 768px) {
            padding: 15px;
          }
          .moblie {
            display: none;
            @media (max-width: 768px) {
              display: block;
            }
          }
          .opacity {
            opacity: 100%;
            @media (max-width: 768px) {
              opacity: 0%;
            }
          }
          .titleFitler {
            margin-bottom: 30px;

            @media (max-width: 768px) {
              padding: 20px;
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
            .filterGroup {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 50px;
              gap: 10px;
              @media (max-width: 1024px) {
                flex-direction: column;
                margin-top: 15px;
              }
              label {
                display: flex;
                align-items: center;
                span {
                  margin-right: 10px;
                  font-weight: 600;
                  color: #444;
                  font-size: 15px;
                  @media (max-width: 768px) {
                    font-size: 13px;
                  }
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
                @media (max-width: 768px) {
                  font-size: 13px;
                  padding: 5px;
                }
              }

              .datePicker {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                font-size: 16px;
                transition: border-color 0.3s;
                @media (max-width: 768px) {
                  font-size: 13px;
                  padding: 5px;
                }
              }
            }
          }
          .fetchButton {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            background-color: #05aced;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            @media (max-width: 768px) {
              font-size: 13px;
              margin-top: 10px;
            }
          }
          .fetchButton:hover {
            background-color: #69c2ef;
          }
          .result {
            display: flex;
            flex-direction: column;
            margin: 70px 0 50px 0;
            @media (max-width: 768px) {
              margin: 20px 0 50px 0;
            }
            h3 {
              margin-bottom: 15px;
              text-align: center;
            }
            h4 {
              width: 100%;
              padding: 10px 0;
              color: #222;
              font-weight: 600;
              font-size: 15px;
              margin-bottom: 10px;
              text-align: center;
              @media (max-width: 768px) {
                margin-bottom: 5px;
                transform: translateX(-50%);
              }
            }

            .section {
              background-color: #ffffff;
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
                width: 50%;
              }
              div {
                justify-content: flex-end;
              }
              &.item_categorys div {
                justify-content: flex-start;
              }
              &:not(:first-child) h4 {
                padding-left: 10px;
              }
            }
          }
          /*------------------요약 파란박스 -------------------- */
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
              width: 100%;
              text-align: center;
              margin: 20px 0 20px 0;
            }
            h4 {
              margin: 0;
              padding-left: 10px;
              text-align: center;
            }
            .row {
              .item_categorys div {
                text-align: left;
              }
              div {
                text-align: right;
              }
              .column:first-of-type {
                div {
                  &:first-of-type {
                    border-top-left-radius: 8px;
                  }
                  &:last-of-type {
                    border-bottom-left-radius: 8px;
                  }
                }
              }
              .column:last-of-type {
                div {
                  &:first-of-type {
                    border-top-right-radius: 8px;
                  }
                  &:last-of-type {
                    border-bottom-right-radius: 8px;
                  }
                }
              }
              @media (max-width: 768px) {
                .column:nth-of-type(2) {
                  div {
                    &:first-of-type {
                      border-top-right-radius: 8px;
                    }
                    &:last-of-type {
                      border-bottom-right-radius: 8px;
                    }
                  }
                }
                .column:nth-of-type(3) {
                  div {
                    &:first-of-type {
                      border-top-left-radius: 8px;
                    }
                    &:last-of-type {
                      border-bottom-left-radius: 8px;
                    }
                  }
                }
              }
            }
            .column div {
              background-color: white;
              font-size: 14px;
              line-height: 40px;
              padding: 0 10%;
              &:not(:last-of-type) {
                border-bottom: 1px solid #d9d9d9;
              }
              @media (max-width: 768px) {
                padding: 0 6%;
                line-height: 35px;
                font-size: 13px;
              }
            }
          }
          /*-------------------------------------- */
          .income,
          .expense {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 10px;
            @media (max-width: 768px) {
              gap: 5px;
            }
            div {
              display: flex;
              padding: 5px 10px;
              font-size: 14px;
              font-weight: 500;
              background-color: #f4f4f4;
              justify-content: space-between;

              @media (max-width: 768px) {
                font-size: 13px;
              }
            }

            .noDataMessage {
              color: #ff0000;
              text-align: center;
              font-weight: bold;
              margin-top: 20px;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default MonthlyView;
