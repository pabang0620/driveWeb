import { useEffect, useMemo, useState } from "react";
import { getMypage } from "./ApiGet";
import { useNavigate } from "react-router-dom";

import Spinner from "./Spinner"; // Spinner 컴포넌트 임포트

import "./components.scss";

const Dashboard = ({ dateRange, getDate, setLoading, setError }) => {
  const navigate = useNavigate();
  const handleMoreClick = () => {
    navigate("/driving_log/dashboard");
  };
  const formatNumber = (num) => {
    return Number(num).toLocaleString();
  };
  const [data, setData] = useState({
    totalIncome: 0,
    todayIncome: 0,
    totalMileage: 0,
    todayDrivingDistance: 0,
    netProfit: 0,
    todayNetProfit: 0,
    totalMileagePercentage: 0,
    totalIncomePercentage: 0,
    netProfitPercentage: 0,
    totalExpense: 0,
    totalDrivingTimeHours: "0.00",
    todayExpense: 0,
    todayDrivingTimeHours: "0.00",
    totalExpensePercentage: 0, // 지출 퍼센트
    totalDrivingTimePercentage: 0, // 운행시간 퍼센트
  });

  const [loading, setLoadingState] = useState(true);
  const [error, setErrorState] = useState(null);

  const getItems = (data) => {
    if (!data) return [];

    const items = [
      {
        title: "총 수입",
        value: formatNumber(data.totalIncome), // 천단위 구분 적용
        subTitle: "최신 수입",
        subValue: formatNumber(data.todayIncome), // 천단위 구분 적용
        topPercentage: data.totalIncome > 0 ? data.totalIncomePercentage : null, // 값이 0이면 퍼센테이지 숨김
      },
      {
        title: "총 주행거리",
        value: `${formatNumber(data.totalMileage)} km`, // 천단위 구분 적용
        subTitle: "최신 주행거리",
        subValue: `${formatNumber(data.todayDrivingDistance)} km`,
        topPercentage:
          data.totalMileage > 0 ? data.totalMileagePercentage : null, // 값이 0이면 퍼센테이지 숨김
      },
      {
        title: "총 손익(초과금)",
        value: formatNumber(data.netProfit), // 천단위 구분 적용
        subTitle: "최신 손익(초과금)",
        subValue: formatNumber(data.todayNetProfit), // 천단위 구분 적용
        topPercentage: data.netProfit > 0 ? data.netProfitPercentage : null, // 값이 0이면 퍼센테이지 숨김
      },
      {
        title: "총 지출",
        value: formatNumber(data.totalExpense), // 천단위 구분 적용
        subTitle: "최신 지출",
        subValue: formatNumber(data.todayExpense), // 천단위 구분 적용
        topPercentage:
          data.totalExpense > 0 ? data.totalExpensePercentage : null, // 값이 0이면 퍼센테이지 숨김
      },
      {
        title: "총 운행 시간",
        value: `${data.totalDrivingTimeHours} 시간`,
        subTitle: "최신 운행 시간",
        subValue: `${data.todayDrivingTimeHours} 시간`,
        topPercentage:
          data.totalDrivingTimeHours > 0
            ? data.totalDrivingTimePercentage
            : null, // 값이 0이면 퍼센테이지 숨김
      },
    ];

    return items;
  };

  const items = useMemo(() => getItems(data), [data]);

  const fetchMyPageData = async () => {
    try {
      const response = await getMypage(dateRange.startDate, dateRange.endDate);
      console.log("들어오는 데이터 확인", response);

      // 상태 업데이트 (백엔드 응답에 맞게 수정)
      setData({
        totalIncome: response.total.income,
        todayIncome: response.today.income,
        totalMileage: response.total.mileage,
        todayDrivingDistance: response.today.drivingDistance,
        netProfit: response.total.netProfit,
        todayNetProfit: response.today.netProfit,
        totalMileagePercentage: response.total.mileagePercent,
        totalIncomePercentage: response.total.incomePercent,
        netProfitPercentage: response.total.netProfitPercent,
        totalExpense: response.total.expense,
        totalDrivingTimeHours: response.total.drivingTime, // 운행 시간 (총합)
        todayExpense: response.today.expense,
        todayDrivingTimeHours: response.today.drivingTime, // 오늘의 운행 시간
        totalExpensePercentage: response.total.expensePercent, // 지출 퍼센트 연동
        totalDrivingTimePercentage: response.total.drivingTimePercent, // 운행 시간 퍼센트 연동
      });

      setLoadingState(false);
    } catch (error) {
      setErrorState(error);
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchMyPageData();
  }, [dateRange]); // dateRange 변경될 때마다 호출

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data)
    return (
      <div
        style={{
          width: "80%",
          margin: "0 auto",
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#666",
        }}
      >
        아직 데이터 수집 중입니다.
      </div>
    );

  return (
    <div className="dashboard_container">
      <h3>나의 운행현황</h3>
      <div className="dashboard">
        {items.map((item, index) => (
          <div className="dashboard_item" key={index}>
            <div>
              <div>
                <h4>{item.title}</h4>
                <p>
                  {item.value}
                  {item.title.includes("시간") ||
                  item.title.includes("주행거리")
                    ? ""
                    : "원"}{" "}
                </p>
              </div>
              <div>
                <h5>{item.subTitle} : </h5>
                <p>
                  {item.subValue}
                  {item.subTitle.includes("시간") ||
                  item.subTitle.includes("주행거리")
                    ? ""
                    : "원"}{" "}
                </p>
              </div>
            </div>
            {item.topPercentage !== null && (
              <p className="top_percent">상위 {item.topPercentage}%</p>
            )}
          </div>
        ))}
        <div
          className="dashboard_item more_style_button"
          onClick={handleMoreClick}
        >
          <div>운행일지 대시보드에서 더보기</div>
        </div>
      </div>

      {/* 스타일링 */}
    </div>
  );
};

export default Dashboard;
