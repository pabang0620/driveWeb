import { useEffect, useState } from "react";
import { getMypage } from "../../components/ApiGet";

const Dashboard = ({ dateRange, getDate, setLoading, setError }) => {
  const [data, setData] = useState({
    totalIncome: 300, // 전체 수입
    todayIncome: 300, // 오늘의 수입
    totalMileage: 15000, // 전체 주행 거리
    todayDrivingDistance: 300, // 오늘의 주행 거리
    netProfit: 300, // 순이익
    todayNetProfit: 300, // 오늘의 순이익
  });

  const items = [
    {
      title: "총 수입",
      value: data.totalIncome,
      subTitle: "당일의 수입",
      subValue: data.todayIncome,
    },
    {
      title: "총 주행거리",
      value: data.totalMileage,
      subTitle: "당일의 주행거리",
      subValue: data.todayDrivingDistance,
    },
    {
      title: "총 손익(초과금)",
      value: data.netProfit,
      subTitle: "당일의 손익(초과금)",
      subValue: data.todayNetProfit,
    },
  ];

  // 마이페이지 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      const response = await getMypage(startDate, endDate); // getMypage 호출로 응답 받기
      setData(response.data); // 응답에서 데이터 추출 및 상태 업데이트
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
    <div className="dashboard_container">
      <h3>나의 운형현황</h3>
      <div className="dashboard">
        {items.map((item, index) => (
          <div className="dashboard_item" key={index}>
            <div>
              <h4>{item.title}</h4>
              <p>{item.value}원</p>
            </div>
            <div>
              <h5>{item.subTitle} : </h5>
              <p>{item.subValue}원</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .dashboard_container {
          width: 100%;

          h3 {
            font-size: 20px;
          }
          .dashboard {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            .dashboard_item {
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              width: 31%;
              padding: 2%;
              background-color: white;
              border-radius: 5px;
              div {
                display: flex;
                justify-content: space-between;
                align-items: center;
                &:nth-of-type(1) {
                  border-bottom: 1px solid #d9d9d9;
                  padding-bottom: 10px;
                  margin-bottom: 10px;
                  h4 {
                    color: #666;
                    font-size: 18px;
                  }
                  p {
                    color: #05aced;
                    font-size: 18px;
                  }
                }
                &:not(:nth-of-type(1)) {
                  padding-left: 5%;
                  font-weight: normal;
                  line-height: 22px;
                  h5 {
                    font-weight: normal;
                    color: #666;
                    font-size: 15px;
                  }
                  p {
                    color: #666;
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
