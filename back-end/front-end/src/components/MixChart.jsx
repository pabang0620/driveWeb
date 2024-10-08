import ApexChart from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import {
  getMypageExpenseSummary,
  getMypageIncomeSummary,
  getMypageMix,
} from "./ApiGet";
//useMemo : 주로 계산 비용이 큰 값이나 객체에 사용

const MixChart = ({ dateRange, getDate, setLoading, setError, title, url }) => {
  // 꺾은선 - 주행거리, 근무시간
  //막대 - 총수입금
  const [data, setData] = useState([]);

  // 데이터를 날짜순으로 정렬하고 각 항목을 별도의 배열로 반환하는 함수
  const processData = (data) => {
    // 날짜순으로 데이터 정렬
    const sortedData = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // 각 항목을 배열로 추출
    const dates = sortedData.map((item) => item.date);
    const drivingDistances = sortedData.map((item) => item.drivingDistance);
    const workingHours = sortedData.map((item) => item.workingHours);
    const totalIncomes = sortedData.map((item) => item.totalIncome);

    return { dates, drivingDistances, workingHours, totalIncomes };
  };

  // 데이터를 처리하여 정렬된 배열과 각 항목 배열을 얻음
  const { dates, drivingDistances, workingHours, totalIncomes } = useMemo(
    () => processData(data),
    [data]
  );

  const series = useMemo(
    () => [
      {
        name: "주행거리",
        data: drivingDistances,
        type: "line",
      },
      {
        name: "근무시간",
        data: workingHours,
        type: "line",
      },
      {
        name: "총 수입금",
        data: totalIncomes,
        type: "column",
      },
    ],
    [drivingDistances, workingHours, totalIncomes]
  );

  const labels = useMemo(() => [dates]);

  const [options, setOptions] = useState({
    chart: {
      width: "100%",
      height: "100%",
      toolbar: {
        show: true,
      },
    },

    colors: [
      "#D5AAFF", // Light Lavender
      "#C5E1A5", // Mint Green
      "#FFABAB", // Soft Pink
    ], // 시리즈 색상 설정
    stroke: {
      width: [4, 4, 0],
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
    series: series,
    xaxis: {
      categories: dates, // x축에 날짜 설정
    },

    // responsive: [
    //   {
    //     breakpoint: 500, // 반응형 디자인을 적용할 화면 크기 최대값을 설정
    //     options: {
    //       chart: {
    //         height: 500, // 반응형 디자인에서 차트의 너비를 설정
    //       },
    //       legend: {
    //         show: true, // 반응형 디자인에서 범례의 표시 여부
    //       },
    //     },
    //   },
    // ],
  });

  //마이페이지 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      const response = await getMypageMix(startDate, endDate); // getMypage 호출로 응답 받기

      console.log("믹스차트", response.data);
      // 데이터가 실제로 변경된 경우에만 상태 업데이트
      if (response !== data) {
        setData(response);
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
    <div className="barChart_container">
      <h3>{title}</h3>
      <div className="barChart">
        <ApexChart options={options} series={series} height={450} />
      </div>
      <style jsx>{`
        .barChart_container {
          width: 100%;
          height: 500px; /* 컨테이너 높이 설정 */
          .barChart {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 2%;
            border-radius: 5px;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};
export default MixChart;
