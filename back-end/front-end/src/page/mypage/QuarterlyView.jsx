import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";

function QuarterlyView() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(1);
  const [quarterlyData, setQuarterlyData] = useState({
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
    if (quarterlyData.income.length > 0) {
      console.log("Updated quarterly data:", quarterlyData);
    }
  }, [quarterlyData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching quarterly data for:", year, quarter);

      const response = await api.get(
        `/tax/profitLossStatement/quarterly/${year}/${quarter}`
      );
      const data = response.data;
      setQuarterlyData({
        income: data.income || [],
        expense: data.expense || [],
        totalIncome: {
          ...quarterlyData.totalIncome,
          ...data.totalIncome,
        },
        totalExpense: {
          ...quarterlyData.totalExpense,
          ...data.totalExpense,
          estimatedTotalTax:
            parseFloat(data.totalExpense.estimatedTotalTax) || 0,
        },
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  const handleQuarterChange = (event) => {
    setQuarter(Number(event.target.value));
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
    <div className="quarterlyView">
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
      <div className="result">
        {quarterlyData.income.length === 0 && (
          <div className="noDataMessage">
            기간을 설정하고 조회를 눌러주세요.
          </div>
        )}
        {quarterlyData.income.length > 0 && (
          <>
            <div className="section">
              <h3>수익 및 지출 항목별 상세</h3>
              <div className="row">
                <div className="column">
                  <h4>항목</h4>
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
                ))}
              </div>
            </div>
            <hr style={{ borderColor: "black", margin: "20px 0" }} />
            <div className="section">
              <h3>수익 및 지출 계산</h3>
              <div className="row">
                <div className="column">
                  <h4>항목</h4>
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
                            Object.values(quarterlyData.expense[index]).reduce(
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
                            (quarterlyData.expense[index].other_expense || 0) -
                            Object.values(quarterlyData.expense[index]).reduce(
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
                            (quarterlyData.expense[index].other_expense || 0) -
                            Object.values(quarterlyData.expense[index]).reduce(
                              (a, b) => a + b,
                              0
                            ) -
                            quarterlyData.totalExpense.estimatedTotalTax) /
                            4
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .quarterlyView {
          padding: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
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
        .fetchButton {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .fetchButton:hover {
          background-color: #45a049;
        }
        .result {
          display: flex;
          flex-direction: column;
          margin-bottom: 30px;
          overflow-x: auto;
        }
        .section {
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          min-height: 150px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .column {
          min-width: 120px;
          flex-shrink: 0;
        }
        .income,
        .expense {
          display: flex;
          flex-direction: column;
        }
        .income div,
        .expense div {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        h3 {
          margin: 10px 0px;
        }
        .divider {
          width: 100%;
          height: 2px;
          background-color: black;
          margin: 10px 0;
        }
        .noDataMessage {
          color: #ff0000;
          text-align: center;
          font-weight: bold;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}

export default QuarterlyView;
