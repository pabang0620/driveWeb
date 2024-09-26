import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";
import MaintenanceEditModal from "../../components/MaintenanceEditModal";
import useCheckPermission from "../../utils/useCheckPermission";
import "./mycar.scss";

const MyCarLog = () => {
  useCheckPermission();

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

        // 데이터 필터링: edited가 2인 경우 maintenanceCost가 0보다 큰 데이터만 남김
        const filteredRecords = response.data.records.filter((record) => {
          if (record.edited === 2) {
            return record.maintenanceCost > 0;
          }
          return true;
        });

        setRecords(filteredRecords);
        setTotalPages(response.data.totalPages);
        setTotalCount(filteredRecords.length); // 필터링된 records의 길이로 totalCount 설정
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
                <div className="displayRow">
                  <div className="date-and-distance">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </div>
                  <div className="edited-notification">장비 설정 수정</div>
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
    </div>
  );
};

export default MyCarLog;
