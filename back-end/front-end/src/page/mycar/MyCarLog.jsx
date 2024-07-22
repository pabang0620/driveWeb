import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";

const MyCarLog = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/maintenance/logAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            pageSize: 10,
          },
        });
        setRecords(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="myCarLog">
      <TitleBox title="차계부" subtitle=" 차량정보" />

      <h1>정비 기록</h1>
      <table>
        <thead>
          <tr>
            <th>정비 항목</th>
            <th>정비 날짜</th>
            <th>정비 방법</th>
            <th>정비 비용</th>
            <th>차량 ID</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.maintenance_items.name}</td>
              <td>{new Date(record.maintenanceDate).toLocaleDateString()}</td>
              <td>{record.maintenanceMethod}</td>
              <td>
                {record.maintenanceCost !== null
                  ? record.maintenanceCost.toLocaleString()
                  : "정보 없음"}{" "}
                원
              </td>
              <td>{record.carId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page <= 1}>
          이전
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page >= totalPages}>
          다음
        </button>
      </div>
    </div>
  );
};

export default MyCarLog;
