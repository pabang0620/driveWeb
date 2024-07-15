import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
  const [data, setData] = useState({
    totalIncome: 0,
    todayIncome: 0,
    totalMileage: 0,
    todayDrivingDistance: 0,
    netProfit: 0,
    todayNetProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get("/api/mypage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []);

  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="container mypage-container">
      <h2>My Page</h2>
      <div className="mypage-data">
        <div className="data-item">
          <h3>Total Income</h3>
          <p>{data.totalIncome}</p>
        </div>
        <div className="data-item">
          <h3>Today's Income</h3>
          <p>{data.todayIncome}</p>
        </div>
        <div className="data-item">
          <h3>Total Mileage</h3>
          <p>{data.totalMileage}</p>
        </div>
        <div className="data-item">
          <h3>Today's Driving Distance</h3>
          <p>{data.todayDrivingDistance}</p>
        </div>
        <div className="data-item">
          <h3>Net Profit</h3>
          <p>{data.netProfit}</p>
        </div>
        <div className="data-item">
          <h3>Today's Net Profit</h3>
          <p>{data.todayNetProfit}</p>
        </div>
      </div>
      <style jsx>{`
        .mypage-container {
          padding: 30px 0;
          margin: 0 auto;
        }
        .mypage-data {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .data-item {
          width: 30%;
          padding: 20px;
          margin: 10px 0;
          background-color: #f0f3f5;
          border-radius: 5px;
          text-align: center;
        }
        h3 {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default MyPage;
