import ApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import { getMypageMix } from "./ApiGet";
import "./components.scss";

const MixChart = ({ dateRange, setLoading, setError, title, isBlurred }) => {
  const [series, setSeries] = useState([]);
  const [dates, setDates] = useState([]);

  const fetchMyPageData = async () => {
    try {
      setLoading(true);
      const response = await getMypageMix(
        dateRange.startDate,
        dateRange.endDate
      );
      console.log("믹스차트 데이터:", response);

      // 데이터 정제
      const dates = response.map((item) => item.date);
      const drivingDistances = response.map((item) =>
        Number(item.driving_distance)
      );
      const totalIncomes = response.map((item) => Number(item.total_income));

      // 정제된 데이터로 시리즈 설정
      setSeries([
        {
          name: "총 수입금",
          data: totalIncomes,
          type: "column",
          yAxisIndex: 0, // 왼쪽 Y축
        },
        {
          name: "주행거리",
          data: drivingDistances,
          type: "line",
          yAxisIndex: 1, // 오른쪽 Y축
        },
      ]);

      setDates(dates); // xaxis의 categories 설정을 위해 날짜 배열 저장
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isBlurred) {
      fetchMyPageData();
    }
  }, [dateRange]);

  const options = {
    chart: {
      width: "100%",
      height: "100%",
      toolbar: {
        show: true,
      },
    },
    colors: ["#D5AAFF", "#C5E1A5"], // 시리즈 색상 설정
    stroke: {
      width: [0, 4],
    },
    plotOptions: {
      bar: {
        columnWidth: "30%", // 막대 너비
      },
    },
    dataLabels: {
      enabled: false, // 그래프 안에 수치 표시 여부
    },
    legend: {
      position: "top",
      offsetY: 10,
      labels: {
        colors: "#333",
        style: {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
        },
      },
    },
    xaxis: {
      title: {
        text: "날짜",
      },
      type: "category",
      categories: dates, // 날짜를 x축 카테고리로 사용
      labels: {
        rotate: -45,
        style: { fontSize: "12px", colors: "#333" },
      },
    },
    yaxis: [
      {
        title: {
          text: "총 수입금",
        },
        labels: {
          formatter: (value) => value,
        },
      },
      {
        opposite: true, // 오른쪽 Y축
        title: {
          text: "주행거리",
        },
        labels: {
          formatter: (value) => value,
        },
      },
    ],
  };

  return (
    <div className={`barChart_container ${isBlurred ? "blurred" : ""}`}>
      <h3>{title}</h3>
      <div className="barChart">
        {dates.length > 0 ? (
          <ApexChart options={options} series={series} height={450} />
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MixChart;
