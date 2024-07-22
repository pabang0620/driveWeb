import ApexChart from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import {
  getMypageExpenseSummary,
  getMypageIncomeSummary,
} from "../../components/ApiGet";
//useMemo : 주로 계산 비용이 큰 값이나 객체를 메모이제이션하는 데 사용
const generateColors = (num) => {
  // 기본 색상 팔레트 (Material Design 색상)
  const baseColors = [
    "#FFABAB", // Soft Pink
    "#FFC3A0", // Light Peach
    "#FDCB82", // Warm Yellow
    "#C5E1A5", // Light Green
    "#B9FBC0", // Light Mint
    "#B3E5FC", // Light Blue
    "#FF8A80", // Light Red
    "#CFD8DC", // Light Grey
    "#F8E9A1", // Pale Yellow
    "#FFAB91", // Light Coral
    "#FF6F61", // Coral
    "#FFD3B6", // Light Apricot
    "#D5AAFF", // Light Lavender
    "#C5E1A5", // Mint Green
    "#B9FBC0", // Pale Green
  ];
  // 색상 수가 baseColors 배열의 길이보다 작을 때
  if (num <= baseColors.length) {
    return baseColors.slice(0, num);
  }

  // 색상 수가 baseColors 배열의 길이보다 클 경우 반복하여 반환
  const colors = [];
  for (let i = 0; i < num; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
};

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
  const getItems = (type) => {
    const incomeData = [
      { name: "카드 소득", data: data.card_income },
      { name: "현금 소득", data: data.cash_income },
      { name: "카카오 소득", data: data.kakao_income },
      { name: "온다 소득", data: data.onda_income },
      { name: "기타 소득", data: data.other_income },
      { name: "타다 소득", data: data.tada_income },
      { name: "우버 소득", data: data.uber_income },
      { name: "예비 소득 항목 1", data: data.income_spare1 },
      { name: "예비 소득 항목 2", data: data.income_spare2 },
      { name: "예비 소득 항목 3", data: data.income_spare3 },
      { name: "예비 소득 항목 4", data: data.income_spare4 },
    ];

    const expenseData = [
      { name: "벌금 지출", data: data.fine_expense },
      { name: "연료 지출", data: data.fuel_expense },
      { name: "식사 지출", data: data.meal_expense },
      { name: "기타 지출", data: data.other_expense },
      { name: "통행료 지출", data: data.toll_expense },
      { name: "예비 지출 항목 1", data: data.expense_spare1 },
      { name: "예비 지출 항목 2", data: data.expense_spare2 },
      { name: "예비 지출 항목 3", data: data.expense_spare3 },
      { name: "예비 지출 항목 4", data: data.expense_spare4 },
    ];

    return type === "incomeSummary" ? incomeData : expenseData;
  };

  const items = useMemo(() => getItems(url), [data]);

  const series = useMemo(() => items.map((item) => item.data), [items]);
  const labels = useMemo(() => items.map((item) => item.name), [items]);

  const [options, setOptions] = useState({
    chart: {
      width: "100%",
      height: "100%",
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        offsetY: 20,
        donut: {
          size: "50%", // 도넛띠 너비
        },
      },
    },
    stroke: {
      width: 0,
    },

    dataLabels: {
      enabled: false, // 그래프 안에 수치 표시 여부
    },
    legend: {
      position: "top", // 범례의 위치를 설정합니다
      offsetY: 10, // 범례의 Y축 오프셋을 설정\
      labels: {
        colors: "#333", // 폰트 색상
        style: {
          fontSize: "16px", // 폰트 사이즈 조정
          fontFamily: "Arial, sans-serif", // 폰트 패밀리 조정 (옵션)
        },
      },
    },
    responsive: [
      {
        breakpoint: 500, // 반응형 디자인을 적용할 화면 크기 최대값을 설정
        options: {
          chart: {
            width: 500, // 반응형 디자인에서 차트의 너비를 설정
          },
          legend: {
            show: true, // 반응형 디자인에서 범례의 표시 여부
          },
        },
      },
    ],
    colors: generateColors(items.length), // 항목 수에 따라 색상 배열 생성
  });

  //마이페이지 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      let response;

      if (url === "incomeSummary") {
        response = await getMypageIncomeSummary(startDate, endDate); // getMypage 호출로 응답 받기
      } else if (url === "expenseSummary") {
        response = await getMypageExpenseSummary(startDate, endDate); // getMypage 호출로 응답 받기
      }
      // 데이터가 실제로 변경된 경우에만 상태 업데이트
      if (response.data !== data) {
        setData(response.data);
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
            labels: labels,
          }}
          series={series}
          type="donut"
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
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
export default CircularChart;
