import ApexChart from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import Spinner from "../../components/Spinner"; // Spinner 컴포넌트 임포트
import {
  getMypageExpenseSummary,
  getMypageIncomeSummary,
} from "../../components/ApiGet";

const generateColors = (num) => {
  const baseColors = [
    "#FFABAB",
    "#FFC3A0",
    "#FDCB82",
    "#C5E1A5",
    "#B9FBC0",
    "#B3E5FC",
    "#FF8A80",
    "#CFD8DC",
    "#F8E9A1",
    "#FFAB91",
    "#FF6F61",
    "#FFD3B6",
    "#D5AAFF",
    "#C5E1A5",
    "#B9FBC0",
  ];
  if (num <= baseColors.length) {
    return baseColors.slice(0, num);
  }
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
  const [data, setData] = useState(null);
  const [loading, setLoadingState] = useState(true);
  const [error, setErrorState] = useState(null);

  const getItems = (type) => {
    if (!data) return [];
    const incomeData = [
      { name: "카드 소득", data: data.card_income },
      { name: "현금 소득", data: data.cash_income },
      { name: "카카오 소득", data: data.kakao_income },
      { name: "온다 소득", data: data.onda_income },
      { name: "기타 소득", data: data.other_income },
      { name: "타다 소득", data: data.tada_income },
      { name: "우버 소득", data: data.uber_income },
      { name: "예비 소득 항목 1", data: data.income_spare_1 },
      { name: "예비 소득 항목 2", data: data.income_spare_2 },
      { name: "예비 소득 항목 3", data: data.income_spare_3 },
      { name: "예비 소득 항목 4", data: data.income_spare_4 },
    ];

    const expenseData = [
      { name: "벌금 지출", data: data.fine_expense },
      { name: "연료 지출", data: data.fuel_expense },
      { name: "식사 지출", data: data.meal_expense },
      { name: "기타 지출", data: data.other_expense },
      { name: "통행료 지출", data: data.toll_expense },
      { name: "예비 지출 항목 1", data: data.expense_spare_1 },
      { name: "예비 지출 항목 2", data: data.expense_spare_2 },
      { name: "예비 지출 항목 3", data: data.expense_spare_3 },
      { name: "예비 지출 항목 4", data: data.expense_spare_4 },
    ];

    const itemsData = type === "incomeSummary" ? incomeData : expenseData;

    // 0인 값을 제외한 항목만 반환
    return itemsData.filter((item) => item.data > 0);
  };

  const items = useMemo(() => getItems(url), [data, url]);
  const series = useMemo(() => items.map((item) => item.data), [items]);
  const labels = useMemo(() => items.map((item) => item.name), [items]);

  const [options, setOptions] = useState({
    chart: {
      width: "100%",
      height: "100%",
      type: "donut",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      pie: {
        offsetY: 30,
        donut: {
          size: "50%",
        },
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      offsetY: 20,
      labels: {
        colors: "#333",
        style: {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
        },
      },
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          chart: {
            width: 500,
          },
          legend: {
            show: true,
          },
        },
      },
    ],
    colors: generateColors(items.length),
  });

  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      let response;

      if (url === "incomeSummary") {
        response = await getMypageIncomeSummary(startDate, endDate);
      } else if (url === "expenseSummary") {
        response = await getMypageExpenseSummary(startDate, endDate);
      }
      console.log(response);
      if (response !== data) {
        setData(response);
      }

      setLoadingState(false);
    } catch (error) {
      setErrorState(error);
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchMyPageData();
  }, [dateRange]);

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

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
            height: 85%;
            aspect-ratio: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CircularChart;
