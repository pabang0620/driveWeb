import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";

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
      <div className="filterGroup">
        <label>
          <span>시작 월 선택</span>
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
          <span>종료 월 선택</span>
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
      <div className="result">
        {monthlyData.income.length === 0 && (
          <div className="noDataMessage">
            기간을 설정하고 조회를 눌러주세요.
          </div>
        )}
        {monthlyData.income.length > 0 && (
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
                  <div className="column" key={index}>
                    <h4>{`${startDate.getFullYear()}년 ${
                      startDate.getMonth() + index + 1
                    }월`}</h4>
                    <div>
                      <span
                        style={{
                          color:
                            Object.values(income).reduce((a, b) => a + b, 0) -
                              Object.values(monthlyData.expense[index]).reduce(
                                (a, b) => a + b,
                                0
                              ) >
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
                              (monthlyData.expense[index].other_expense || 0) -
                              Object.values(monthlyData.expense[index]).reduce(
                                (a, b) => a + b,
                                0
                              ) >
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
                              (monthlyData.expense[index].other_expense || 0) -
                              Object.values(monthlyData.expense[index]).reduce(
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
                          Object.values(income).reduce((a, b) => a + b, 0) +
                            (income.other_income || 0) -
                            (monthlyData.expense[index].other_expense || 0) -
                            Object.values(monthlyData.expense[index]).reduce(
                              (a, b) => a + b,
                              0
                            ) -
                            monthlyData.totalExpense.estimatedTotalTax
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
        .monthlyView {
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
          overflow-x: auto; /* 좌우 스크롤 추가 */
        }
        .section {
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          min-height: 150px; /* 최소 높이 추가 */
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start; /* 상단 정렬 */
        }
        .column {
          min-width: 120px;
          flex-shrink: 0; /* 수축 방지 */
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
          background-color: black; /* 수익과 지출 사이에 검은색 선 추가 */
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

export default MonthlyView;
