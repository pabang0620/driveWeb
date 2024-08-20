import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { dummyQuarterlyData } from "../../components/dummy";
function QuarterlyView() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(1);
  // const [quarterlyData, setQuarterlyData] = useState({
  //   income: [],
  //   expense: [],
  //   totalIncome: {
  //     card_income: 0,
  //     cash_income: 0,
  //     kakao_income: 0,
  //     uber_income: 0,
  //     onda_income: 0,
  //     tada_income: 0,
  //     iam_income: 0,
  //     other_income: 0,
  //   },
  //   totalExpense: {
  //     fuel_expense: 0,
  //     toll_fee: 0,
  //     meal_expense: 0,
  //     fine_expense: 0,
  //     expense_spare_1: 0,
  //     expense_spare_2: 0,
  //     card_fee: 0,
  //     maintenanceCost: 0,
  //     insuranceFee: 0,
  //     other_expense: 0,
  //     estimatedTotalTax: 0,
  //   },
  // });
  const [quarterlyData, setQuarterlyData] = useState(dummyQuarterlyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // useEffect(() => {
  //   if (quarterlyData.income.length > 0) {
  //     console.log("Updated quarterly data:", quarterlyData);
  //   }
  // }, [quarterlyData]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("Fetching quarterly data for:", year, quarter);

  //     const response = await api.get(
  //       `/tax/profitLossStatement/quarterly/${year}/${quarter}`
  //     );
  //     const data = response.data;
  //     setQuarterlyData({
  //       income: data.income || [],
  //       expense: data.expense || [],
  //       totalIncome: {
  //         ...quarterlyData.totalIncome,
  //         ...data.totalIncome,
  //       },
  //       totalExpense: {
  //         ...quarterlyData.totalExpense,
  //         ...data.totalExpense,
  //         estimatedTotalTax:
  //           parseFloat(data.totalExpense.estimatedTotalTax) || 0,
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     setError("데이터를 가져오는 중 오류가 발생했습니다.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  const handleQuarterChange = (event) => {
    setQuarter(Number(event.target.value));
  };

  const handleFetchData = () => {
    // fetchData();
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
    <div className="quarterlyView">
      <div className="titleFitler">
        <h3>분기별 수익 및 지출 합계</h3>
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
            <span>분기 선택</span>
            <select value={quarter} onChange={handleQuarterChange}>
              <option value={1}>1분기</option>
              <option value={2}>2분기</option>
              <option value={3}>3분기</option>
              <option value={4}>4분기</option>
            </select>
          </label>
          <button onClick={handleFetchData} className="fetchButton">
            조회
          </button>
        </div>
      </div>

      <div className="result">
        {quarterlyData.income.length === 0 && (
          <div className="noDataMessage">
            기간을 설정하고 조회를 눌러주세요.
          </div>
        )}
        {quarterlyData.income.length > 0 && (
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
                              quarterlyData.totalIncome[key] > 0
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {formatCurrency(quarterlyData.totalIncome[key] || 0)}
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
                              quarterlyData.totalExpense[key] > 0
                                ? "blue"
                                : "inherit",
                          }}
                        >
                          {formatCurrency(quarterlyData.totalExpense[key] || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {quarterlyData.income.map((income, index) => (
                  <>
                    <div className="column moblie item_categorys">
                      <h4 className="opacity">항목</h4>
                      <div className="income">
                        {Object.keys(incomeLabels).map((key) => (
                          <div
                            key={key}
                            style={{ justifyContent: "flex-start" }}
                          >
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
                      <h4>{`${index + 1 + (quarter - 1) * 3} 월`}</h4>
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
                                  quarterlyData.expense[index][key] > 0
                                    ? "blue"
                                    : "inherit",
                              }}
                            >
                              {formatCurrency(
                                quarterlyData.expense[index][key] || 0
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
                          Object.values(quarterlyData.totalIncome).reduce(
                            (a, b) => a + b,
                            0
                          ) -
                            Object.values(quarterlyData.totalExpense).reduce(
                              (a, b) => a + b,
                              0
                            ) >
                          0
                            ? "red"
                            : "blue",
                      }}
                    >
                      {formatCurrency(
                        Object.values(quarterlyData.totalIncome).reduce(
                          (a, b) => a + b,
                          0
                        ) -
                          Object.values(quarterlyData.totalExpense).reduce(
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
                          quarterlyData.totalIncome.other_income > 0
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {formatCurrency(
                        quarterlyData.totalIncome.other_income || 0
                      )}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color:
                          quarterlyData.totalExpense.other_expense > 0
                            ? "blue"
                            : "inherit",
                      }}
                    >
                      {formatCurrency(
                        quarterlyData.totalExpense.other_expense || 0
                      )}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color:
                          Object.values(quarterlyData.totalIncome).reduce(
                            (a, b) => a + b,
                            0
                          ) +
                            (quarterlyData.totalIncome.other_income || 0) -
                            (quarterlyData.totalExpense.other_expense || 0) -
                            Object.values(quarterlyData.totalExpense).reduce(
                              (a, b) => a + b,
                              0
                            ) >
                          0
                            ? "red"
                            : "blue",
                      }}
                    >
                      {formatCurrency(
                        Object.values(quarterlyData.totalIncome).reduce(
                          (a, b) => a + b,
                          0
                        ) +
                          (quarterlyData.totalIncome.other_income || 0) -
                          (quarterlyData.totalExpense.other_expense || 0) -
                          Object.values(quarterlyData.totalExpense).reduce(
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
                          Object.values(quarterlyData.totalIncome).reduce(
                            (a, b) => a + b,
                            0
                          ) +
                            (quarterlyData.totalIncome.other_income || 0) -
                            (quarterlyData.totalExpense.other_expense || 0) -
                            Object.values(quarterlyData.totalExpense).reduce(
                              (a, b) => a + b,
                              0
                            ) -
                            quarterlyData.totalExpense.estimatedTotalTax >
                          0
                            ? "red"
                            : "blue",
                      }}
                    >
                      {formatCurrency(
                        Object.values(quarterlyData.totalIncome).reduce(
                          (a, b) => a + b,
                          0
                        ) +
                          (quarterlyData.totalIncome.other_income || 0) -
                          (quarterlyData.totalExpense.other_expense || 0) -
                          Object.values(quarterlyData.totalExpense).reduce(
                            (a, b) => a + b,
                            0
                          ) -
                          quarterlyData.totalExpense.estimatedTotalTax
                      )}
                    </span>
                  </div>
                </div>
                {quarterlyData.income.map((income, index) => (
                  <>
                    <div className="column moblie item_categorys">
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
                      <h4>{`${index + 1 + (quarter - 1) * 3} 월`}</h4>
                      <div>
                        <span
                          style={{
                            color:
                              Object.values(income).reduce((a, b) => a + b, 0) -
                                Object.values(
                                  quarterlyData.expense[index]
                                ).reduce((a, b) => a + b, 0) >
                              0
                                ? "red"
                                : "blue",
                          }}
                        >
                          {formatCurrency(
                            Object.values(income).reduce((a, b) => a + b, 0) -
                              Object.values(
                                quarterlyData.expense[index]
                              ).reduce((a, b) => a + b, 0)
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
                              quarterlyData.expense[index].other_expense > 0
                                ? "blue"
                                : "inherit",
                          }}
                        >
                          {formatCurrency(
                            quarterlyData.expense[index].other_expense || 0
                          )}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color:
                              Object.values(income).reduce((a, b) => a + b, 0) +
                                (income.other_income || 0) -
                                (quarterlyData.expense[index].other_expense ||
                                  0) -
                                Object.values(
                                  quarterlyData.expense[index]
                                ).reduce((a, b) => a + b, 0) >
                              0
                                ? "red"
                                : "blue",
                          }}
                        >
                          {formatCurrency(
                            Object.values(income).reduce((a, b) => a + b, 0) +
                              (income.other_income || 0) -
                              (quarterlyData.expense[index].other_expense ||
                                0) -
                              Object.values(
                                quarterlyData.expense[index]
                              ).reduce((a, b) => a + b, 0)
                          )}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            color:
                              Object.values(income).reduce((a, b) => a + b, 0) +
                                (income.other_income || 0) -
                                (quarterlyData.expense[index].other_expense ||
                                  0) -
                                Object.values(
                                  quarterlyData.expense[index]
                                ).reduce((a, b) => a + b, 0) -
                                quarterlyData.totalExpense.estimatedTotalTax >
                              0
                                ? "red"
                                : "blue",
                          }}
                        >
                          {formatCurrency(
                            (Object.values(income).reduce((a, b) => a + b, 0) +
                              (income.other_income || 0) -
                              (quarterlyData.expense[index].other_expense ||
                                0) -
                              Object.values(
                                quarterlyData.expense[index]
                              ).reduce((a, b) => a + b, 0) -
                              quarterlyData.totalExpense.estimatedTotalTax) /
                              4
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
      <style jsx>
        {`
          .quarterlyView {
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
              margin-bottom: 60px;
              @media (max-width: 768px) {
                margin-bottom: 20px;
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
              }
            }

            .result {
              display: flex;
              flex-direction: column;
              margin-bottom: 30px;
              overflow-x: auto;
              @media (max-width: 768px) {
                margin: 20px 0 50px 0;
              }
              h3 {
                margin-bottom: 10px;
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
                min-width: 120px;
                flex-shrink: 0;
                width: 20%;
                @media (max-width: 768px) {
                  width: 50%;
                }
                div div {
                  text-align: right;
                }

                &.item_categorys div div {
                  text-align: left;
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
                }
                .row {
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
                    .column:nth-of-type(odd) {
                      div {
                        &:first-of-type {
                          border-top-left-radius: 8px;
                        }
                        &:last-of-type {
                          border-bottom-left-radius: 8px;
                        }
                      }
                    }
                    .column:nth-of-type(even) {
                      div {
                        &:first-of-type {
                          border-top-right-radius: 8px;
                        }
                        &:last-of-type {
                          border-bottom-right-radius: 8px;
                        }
                      }
                    }
                  }
                }
                .column div {
                  background-color: white;
                  font-size: 14px;
                  line-height: 40px;
                  padding: 0 8px;
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
            }
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
                width: 100%;
                padding: 5px 10px;
                font-size: 14px;
                font-weight: 500;
                background-color: #f4f4f3;
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
        `}
      </style>
    </div>
  );
}

export default QuarterlyView;
