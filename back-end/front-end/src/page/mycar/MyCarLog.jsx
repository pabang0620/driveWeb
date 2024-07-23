import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";
import MaintenanceEditModal from "../../components/MaintenanceEditModal";

const MyCarLog = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordData, setSelectedRecordData] = useState([]);

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
        setRecords(response.data.records);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount); // totalCount를 별도로 설정
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, [page]);

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRecordClick = (recordId) => {
    const recordData = records.filter((record) => record.id === recordId);
    setSelectedRecordData(recordData);
    setIsModalOpen(true);
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="myCarLog">
      <TitleBox title="차계부" subtitle="정비이력" />
      <div className="MyCarHeader">
        총<span> {totalCount}</span>건
      </div>
      <div className="records-container">
        {records.map((record) => (
          <div key={record.id} className="record-card">
            {record.edited === 1 ? (
              <div>
                <div className="edited-notification">설정을 수정하셨습니다</div>
                <div className="date-and-distance">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
                <div className="logMaintenance-item">
                  {record.maintenance_items && record.maintenance_items.name
                    ? record.maintenance_items.name
                    : "항목 불명"}
                </div>
              </div>
            ) : (
              <div>
                <div className="date-and-distance">
                  {new Date(record.createdAt).toLocaleDateString()} |{" "}
                  {record.mileageAtMaintenance
                    ? `${record.mileageAtMaintenance.toLocaleString()}km`
                    : "0km"}
                </div>
                <div className="logMaintenance-item">
                  <span>
                    {record && record.maintenanceMethod
                      ? record.maintenanceMethod
                      : "정비소"}
                  </span>
                  {record.maintenance_items && record.maintenance_items.name
                    ? record.maintenance_items.name
                    : "항목 불명"}
                </div>
              </div>
            )}
            <div className="myCarLogcost">
              <div
                className="penOppset"
                onClick={() => handleRecordClick(record.id)}
              >
                &#9998;
              </div>
              <div className="myCarMoney">
                {record.maintenanceCost
                  ? `${Number(record.maintenanceCost).toLocaleString()}원`
                  : "0원"}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`pagination-button ${
              page === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <MaintenanceEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recordData={selectedRecordData}
      />
      <style jsx>{`
        .myCarLog {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          .MyCarHeader {
            padding: 30px 20px;
            font-size: 14px;
            color: #4d4d4d;
            font-weight: 700;
            border-bottom: 1px solid #c1c1c1;
          }
          .MyCarHeader span {
            color: #05aced;
          }
          .records-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 20px;
          }
          .record-card {
            padding: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid #e4e4e4;
          }
          .edited-notification {
            font-size: 14px;
            color: #ff0000;
            font-weight: bold;
          }
          .record-detail {
            margin-bottom: 10px;
          }
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
          }
          .pagination-button {
            padding: 10px 15px;
            margin: 0 5px;
            border: none;
            background-color: #05aced;
            color: white;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .pagination-button:disabled {
            background-color: #d3d3d3;
            cursor: not-allowed;
          }
          .pagination-button:not(:disabled):hover {
            background-color: #0288c7;
          }
          .pagination-button.active {
            background-color: #0288c7;
            font-weight: bold;
          }
          .date-and-distance {
            font-size: 11px;
            color: #4c4c4c;
          }
          .logMaintenance-item {
            margin-top: 10px;
            font-size: 16px;
            font-weight: 700;
          }
          .logMaintenance-item span {
            margin: 0 5px 0 0;
            padding: 6px;
            border-radius: 3px;
            background-color: #05aced;
            height: 25px;
            line-height: 25px;
            color: white;
            text-align: center;
            font-size: 11px;
            font-weight: 400;
          }
          .penOppset {
            transform: scaleX(-1);
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
          }
          .myCarMoney {
            font-size: 12px;
            font-weight: 700;
          }
        }
      `}</style>
    </div>
  );
};

export default MyCarLog;
