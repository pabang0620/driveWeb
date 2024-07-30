import { useEffect, useState } from "react";
import { getMypage } from "./ApiGet";
import Spinner from "./Spinner"; // Spinner 컴포넌트 임포트

const Dashboard = ({ dateRange, getDate, setLoading, setError }) => {
  const [data, setData] = useState(null); // 초기값을 null로 설정
  const [loading, setLoadingState] = useState(true);
  const [error, setErrorState] = useState(null);

  const items = data
    ? [
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
      ]
    : [];

  // 마이페이지 데이터 가져오기
  const fetchMyPageData = async () => {
    try {
      const startDate = getDate();
      const endDate = getDate();
      const response = await getMypage(startDate, endDate); // getMypage 호출로 응답 받기
      console.log("들어오는 데이터 확인", response);
      setData(response); // 응답에서 데이터 추출 및 상태 업데이트
      setLoadingState(false);
    } catch (error) {
      setErrorState(error);
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchMyPageData();
  }, [dateRange]); // dateRange가 변경될 때마다 호출

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
                <p>{item.value}원</p>
              </div>
              <div>
                <h5>{item.subTitle} : </h5>
                <p>{item.subValue}원</p>
              </div>
            </div>
            <p className="top_percent">상위 3%</p>
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
              width: 31%;

              & > div {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                background-color: white;
                padding: 5%;
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
              .top_percent {
                color: #05aced;
                font-size: 18px;
                font-weight: 700;
                width: 100%;
                text-align: right;
                margin-top: 10px;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
