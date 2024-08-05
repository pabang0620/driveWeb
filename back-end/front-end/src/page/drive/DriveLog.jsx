import axios from "axios";
import React, { useEffect, useState } from "react";
import DriveWrite from "./DriveWrite";
import DriveIncome from "./DriveIncome";
import DriveExpense from "./DriveExpense";
import DriveDetails from "./DriveDetails"; // 추가
import { getDrive } from "../../components/ApiGet";
import TitleBox from "../../components/TitleBox";

const DriveLog = () => {
  const [driveLog, setDriveLog] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 페이지당 항목 수
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [searchField, setSearchField] = useState("date"); // 검색 필드 상태 추가

  const [currentModal, setCurrentModal] = useState(null); // 현재 열려 있는 모달
  const [selectedLogId, setSelectedLogId] = useState(null); // 선택된 운행 일지 ID

  // 모달 열기 함수
  const openModal = (modalType) => {
    console.log(`Opening modal: ${modalType}`); // 디버깅 로그 추가
    setCurrentModal(modalType);
  };

  // 모달 닫기 함수
  const closeModal = (showConfirm = true) => {
    if (showConfirm) {
      const response = window.confirm("작성을 취소하시겠습니까?");
      if (response) {
        setCurrentModal(null);
        setSelectedLogId(null);
      }
    } else {
      setCurrentModal(null);
      setSelectedLogId(null);
    }
  };

  // 현재 페이지의 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage; //현재 페이지에서 마지막 항목의 다음 인덱스
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫 번째 항목의 인덱스
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 검색어 입력 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 필드 변경 핸들러
  const handleFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  // 검색어에 따라 데이터 필터링
  const handleSearchClick = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = driveLog.filter((item) => {
      const fieldValue = String(item[searchField]).toLowerCase();
      return fieldValue.includes(lowerCaseSearchTerm);
    });
    setFilteredData(filtered);
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  // 운행일지 데이터를 가져와서 포맷팅하는 함수
  const formatDriveData = (data) => {
    return data.map((item) => ({
      ...item,
      date: item.date.split("T")[0],
      working_hours: `${new Date(item.working_hours).getUTCHours()}시간`,
    }));
  };

  // 운행일지-조회 불러오기
  useEffect(() => {
    const getDriveData = async () => {
      try {
        const data = await getDrive();
        const formattedData = formatDriveData(data);
        setDriveLog(formattedData);
        setFilteredData(formattedData); // 필터링 데이터 초기화
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getDriveData();
  }, []);

  // 페이지 수 계산
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  // 페이지 번호 버튼 렌더링
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.min(pageCount, 5); i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? "activePage" : ""}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleRowClick = (drivingLogId) => {
    setSelectedLogId(drivingLogId);
    openModal("driveDetails");
  };

  return (
    <div className="container driving">
      <TitleBox title="운행일지" subtitle="조회" />
      <button className="writeBtn" onClick={() => openModal("driveWrite")}>
        운행일지 작성
      </button>

      {/* DriveWrite에서 다음 버튼 클릭 시 호출될 함수 */}
      {currentModal === "driveWrite" && (
        <DriveWrite
          showModal={true}
          toggleModal={() => openModal("driveIncome")} // 다음 모달을 직접 열기
          closeModal={closeModal}
        />
      )}

      {/* DriveIncome에서 다음 버튼 클릭 시 호출될 함수 */}
      {currentModal === "driveIncome" && (
        <DriveIncome
          showModal={true}
          toggleModal={() => openModal("driveExpense")} // 다음 모달을 직접 열기
          closeModal={closeModal}
        />
      )}

      {/* DriveExpense에서 저장 버튼 클릭 시 호출될 함수 */}
      {currentModal === "driveExpense" && (
        <DriveExpense
          showModal={true}
          toggleModal={() => closeModal(false)} // 마지막 모달은 닫기
          closeModal={closeModal}
        />
      )}

      {/* DriveDetails 모달 */}
      {currentModal === "driveDetails" && (
        <DriveDetails
          showModal={true}
          closeModal={closeModal}
          drivingLogId={selectedLogId}
        />
      )}

      <table className="drivingTable">
        <thead>
          <tr>
            <th>No</th>
            <th>날짜</th>
            <th>주행거리</th>
            <th>운행수익합계</th>
            <th>운행지출합계</th>
            <th>근무시간</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={item.driving_log_id}
              onClick={() => handleRowClick(item.driving_log_id)}
            >
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{item.date}</td>
              <td>{item.driving_distance} km</td>
              <td>{item.total_income} 원</td>
              <td>{item.total_expense} 원</td>
              <td>{item.working_hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          {"<"}
        </button>
        {renderPageNumbers()}
        <button
          onClick={() =>
            currentPage < itemsPerPage && setCurrentPage(currentPage + 1)
          }
        >
          {">"}
        </button>

        <button
          onClick={() =>
            setCurrentPage(Math.ceil(driveLog.length / itemsPerPage))
          }
        >
          {">>"}
        </button>
      </div>
      <div className="search">
        <select value={searchField} onChange={handleFieldChange}>
          <option value="date">날짜</option>
          <option value="driving_distance">주행거리</option>
          <option value="total_income">운행수익합계</option>
          <option value="total_expense">운행지출합계</option>
          <option value="working_hours">근무시간</option>
        </select>
        <input
          type="text"
          placeholder={`${
            searchField === "date"
              ? "날짜로 검색"
              : searchField === "driving_distance"
              ? "주행거리로 검색"
              : searchField === "total_income"
              ? "운행수익합계로 검색"
              : searchField === "total_expense"
              ? "운행지출합계로 검색"
              : "근무시간으로 검색"
          }`}
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSearchClick}>검색</button>
      </div>

      <style jsx>{`
        .driving {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
          h2 {
            font-size: 25px;
            font-weight: 600;
            margin-bottom: 30px;
            float: left;
            span {
              font-size: 20px;
              color: #4c4c4c;
              margin-left: 10px;
            }
          }
          .writeBtn {
            float: right;
          }
          .drivingTable {
            width: 100%;
            font-size: 15px;
            border-top: 1px solid #4c4c4c;
            text-align: center;
            border-collapse: collapse;
            @media (max-width: 768px) {
              font-size: 13px;
            }
            @media (max-width: 480px) {
              font-size: 11px;
            }
            tr {
              width: 100%;
              line-height: 40px;
              th {
                font-weight: normal;
              }
              td {
                border-top: 1px solid #d9d9d9;
                cursor: pointer;
              }
            }
          }
          .pagination {
            width: 100%;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            button {
              width: 40px;
              height: 40px;
              margin: 0 5px;
              background-color: white;
              border: 1px solid rgba(0, 0, 0, 0.1);
              cursor: pointer;
              color: #222;
              &.activePage,
              &:hover {
                color: white;
                background-color: #05aced;
              }
            }
          }
          .search {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 30px;
            input,
            select {
              border-radius: 5px;
              border: 1px solid #c1c1c1;
              padding: 10px;
            }
            input[type="text"] {
              width: 40%;
            }
          }
          button {
            background-color: #05aced;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            padding: 10px;
          }
        }
         {
          /*  */
        }
        .drive {
          .dynamicInput {
            width: 100%;
            border-bottom: 1px solid #d9d9d9;

            label {
              display: inline-block;
              width: 25%;
              color: #c1c1c1;
              padding: 3% 1%;
              @media (max-width: 768px) {
                width: 40%;
                font-size: 13px;
                padding: 3% 0%;
              }
            }
            input {
              border: none;
              background: none;
              color: #c1c1c1;
              width: 70%;
              &:focus {
                color: #222;
              }
              @media (max-width: 768px) {
                font-size: 13px;
                width: 55%;
              }
            }
          }
          button {
            margin: 30px 0;
            float: right;
          }
        }
         {
          /*  */
        }
      `}</style>
    </div>
  );
};

export default DriveLog;
