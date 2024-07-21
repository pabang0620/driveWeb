import ApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import {
  getMypageExpenseSummary,
  getMypageIncomeSummary,
} from "../../components/ApiGet";

const CircularChart = ({
  dateRange,
  getDate,
  setLoading,
  setError,
  title,
  url,
}) => {
  const [data, setData] = useState({
    card_income: 100, // 카드 소득
    cash_income: 500, // 현금 소득
    income_spare1: 300, // 예비 소득 항목 1
    income_spare2: 150, // 예비 소득 항목 2
    income_spare3: 250, // 예비 소득 항목 3
    income_spare4: 100, // 예비 소득 항목 4
    kakao_income: 800, // 카카오 소득
    onda_income: 600, // 온다 소득
    other_income: 200, // 기타 소득
    tada_income: 400, // 타다 소득
    total_income: 4350, // 총 소득
    uber_income: 500, // 우버 소득
    expense_spare1: 50, // 예비 지출 항목 1
    expense_spare2: 75, // 예비 지출 항목 2
    expense_spare3: 30, // 예비 지출 항목 3
    expense_spare4: 60, // 예비 지출 항목 4
    fine_expense: 100, // 벌금 지출
    fuel_expense: 200, // 연료 지출
    meal_expense: 150, // 식사 지출
    other_expense: 80, // 기타 지출
    toll_expense: 40, // 통행료 지출
    total_expense: 695, // 총 지출
  });

  const [options, setOptions] = useState({
    dataLabels: {
      enabled: false, // 그래프 안에 수치 표시 여부
    },
    responsive: [
      {
        //breakpoint: 500, // 반응형 디자인을 적용할 화면 크기 최대값을 설정
        options: {
          chart: {
            //width: 500, // 반응형 디자인에서 차트의 너비를 설정
          },
          legend: {
            show: true, // 반응형 디자인에서 범례의 표시 여부
          },
        },
      },
    ],
    legend: {
      position: "top", // 범례의 위치를 설정합니다
      offsetY: 0, // 범례의 Y축 오프셋을 설정
      // height: 230, // 범례의 높이를 설정
    },
  });

  const incomeItems = [
    { name: "카드 소득", data: data.card_income },
    { name: "현금 소득", data: data.cash_income },
    { name: "예비 소득 항목 1", data: data.income_spare1 },
    { name: "예비 소득 항목 2", data: data.income_spare2 },
    { name: "예비 소득 항목 3", data: data.income_spare3 },
    { name: "예비 소득 항목 4", data: data.income_spare4 },
    { name: "카카오 소득", data: data.kakao_income },
    { name: "온다 소득", data: data.onda_income },
    { name: "기타 소득", data: data.other_income },
    { name: "타다 소득", data: data.tada_income },
    { name: "우버 소득", data: data.uber_income },
  ];

  const expenseItems = [
    { name: "예비 지출 항목 1", data: data.expense_spare1 },
    { name: "예비 지출 항목 2", data: data.expense_spare2 },
    { name: "예비 지출 항목 3", data: data.expense_spare3 },
    { name: "예비 지출 항목 4", data: data.expense_spare4 },
    { name: "벌금 지출", data: data.fine_expense },
    { name: "연료 지출", data: data.fuel_expense },
    { name: "식사 지출", data: data.meal_expense },
    { name: "기타 지출", data: data.other_expense },
    { name: "통행료 지출", data: data.toll_expense },
  ];

  const [series, setSeries] = useState(incomeItems.map((item) => item.data));
  const [chartOptions, setChartOption] = useState(
    incomeItems.map((item) => item.name)
  );
  //마이페이지 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      if (url === "incomeSummary") {
        const response = await getMypageIncomeSummary(startDate, endDate); // getMypage 호출로 응답 받기
        setData(response.data);
        setSeries(incomeItems.map((item) => item.value || 0)); // 소득 데이터를 시리즈에 반영
      } else if (url === "expenseSummary") {
        const response = await getMypageExpenseSummary(startDate, endDate); // getMypage 호출로 응답 받기
        setData(response.data); // 응답에서 데이터 추출 및 상태 업데이트
        setSeries(expenseItems.map((item) => item.value || 0)); // 지출 데이터를 시리즈에 반영
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPageData();
  }, [dateRange]); // dateRange가 변경될 때마다 호출

  return (
    <div className="circularChart_container">
      <h3>{title}</h3>
      <div className="circularChart">
        <ApexChart
          options={{
            ...options,
            labels: chartOptions,
          }}
          series={series}
          type="donut"
          width={500}
        />
      </div>
      <style jsx>{`
        .circularChart_container {
          width: 48.5%;
          .circularChart {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 2%;
            border-radius: 5px;
          }
        }
      `}</style>
    </div>
  );
};
export default CircularChart;
