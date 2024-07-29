import ApexChart from "react-apexcharts";
import { useEffect, useMemo, useState } from "react";
import { getMypageMix } from "../../components/ApiGet";

const MixChart = ({ dateRange, getDate, setLoading, setError, title, url }) => {
  const [data, setData] = useState([]);

  const processData = (data) => {
    if (!Array.isArray(data))
      return {
        dates: [],
        drivingDistances: [],
        workingHours: [],
        totalIncomes: [],
      };

    const sortedData = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const dates = sortedData.map((item) => item.date);
    const drivingDistances = sortedData.map((item) => item.drivingDistance);
    const workingHours = sortedData.map((item) => item.workingHours);
    const totalIncomes = sortedData.map((item) => item.totalIncome);

    return { dates, drivingDistances, workingHours, totalIncomes };
  };

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

  const labels = useMemo(() => dates, [dates]);

  const [options, setOptions] = useState({
    chart: {
      width: "100%",
      height: "100%",
      toolbar: {
        show: true,
      },
    },
    colors: ["#D5AAFF", "#C5E1A5", "#FFABAB"],
    stroke: {
      width: [4, 4, 0],
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    dataLabels: {
      enabled: false,
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
    series: series,
    xaxis: {
      categories: labels,
    },
  });

  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      const response = await getMypageMix(startDate, endDate);

      console.log("믹스차트", response.data);
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
  }, [dateRange]);

  return (
    <div className="barChart_container">
      <h3>{title}</h3>
      <div className="barChart">
        <ApexChart options={options} series={series} height={450} />
      </div>
      <style jsx>{`
        .barChart_container {
          width: 100%;
          height: 500px;
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
