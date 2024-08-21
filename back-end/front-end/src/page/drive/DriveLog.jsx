import axios from "axios";
import React, { useEffect, useState } from "react";
import DriveWrite from "./DriveWrite";
import DriveIncome from "./DriveIncome";
import DriveExpense from "./DriveExpense";
import DriveDetails from "./DriveDetails"; // 추가
import {
  getDrive,
  getJobtype,
  getProfileVehicle,
} from "../../components/ApiGet";
import TitleBox from "../../components/TitleBox";
import { useNavigate, useParams } from "react-router-dom";
import useCheckPermission from "../../utils/useCheckPermission";
import { jwtDecode } from "jwt-decode";

const DriveLog = () => {
  useCheckPermission();
  const { userId } = useParams(); // useParams를 사용하여 userId를 가져옴

  // ----- 정보 미 입력시 라우터 --------
  const [vehicleInfo, setVehicleInfo] = useState({
    carType: "", // 차량종류
    franchise_status: "", // 가맹상태
    vehicle_name: "", // 차량 이름
    year: 0, // 연식
    fuel_type: "", // 연료유형
    mileage: 0, // 누적거리
  });
  const navigate = useNavigate();
  const [userPermission, setUserPermission] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (userId != undefined) {
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserPermission(decodedToken.permission);

        // 권한이 1 또는 2가 아닌 경우 홈으로 리디렉션
        if (decodedToken.permission !== 1 && decodedToken.permission !== 2) {
          alert("접근 권한이 없습니다.");
          navigate("/"); // 홈으로 리디렉션
        }
      }
    }
  }, [navigate]);

  // 회원정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      try {
        const vehicleData = await getProfileVehicle();
        console.log("Vehicle Data:", vehicleData);
        setVehicleInfo(vehicleData);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUserData();
  }, []);

  // ------------------------------------
  const [driveLog, setDriveLog] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 페이지당 항목 수
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [searchField, setSearchField] = useState("date"); // 검색 필드 상태 추가

  const [currentModal, setCurrentModal] = useState(null); // 현재 열려 있는 모달
  const [selectedLogId, setSelectedLogId] = useState(null); // 선택된 운행 일지 ID
  console.log(userId);
  // 모달 열기 함수
  const openModal = (modalType, logId = null) => {
    console.log(`Opening modal: ${modalType}, driving_log_id: ${logId}`);
    setCurrentModal(modalType);
    if (logId) {
      setSelectedLogId(logId);
    }
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
        const data = await getDrive(userId ? { userId } : undefined);
        const formattedData = formatDriveData(data);

        // created_at 기준으로 최신순 정렬
        const sortedData = formattedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setDriveLog(sortedData);
        setFilteredData(sortedData); // 필터링 데이터 초기화
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getDriveData();
  }, [userId]);

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

  if (!vehicleInfo.carType) {
    // 차량 종류가 비어있을 경우 메시지 표시
    return (
      <div className="container">
        <h2>차량 정보를 입력해주세요.</h2>
        <style jsx>{`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 67vh;
            h2 {
              color: #333;
              font-family: "Arial", sans-serif;
              font-size: 24px;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              background-color: #ffffff;
            }
          }
        `}</style>
      </div>
    );
  }
  return (
    <div className="container driving">
      <TitleBox title="운행일지" subtitle="조회" />
      {!userId && (
        <button className="writeBtn" onClick={() => openModal("driveWrite")}>
          운행일지 작성
        </button>
      )}

      {/* DriveWrite에서 다음 버튼 클릭 시 호출될 함수 */}
      {currentModal === "driveWrite" && (
        <DriveWrite
          showModal={true}
          toggleModal={() => openModal("driveIncome")} // 다음 모달을 직접 열기
          closeModal={closeModal}
          drivingLogId={selectedLogId}
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
            <th>수정</th>
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
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 다른 클릭 이벤트를 막기 위해 추가
                    console.log("수정하기 버튼 클릭", item.driving_log_id);
                    openModal("driveWrite", item.driving_log_id); // driving_log_id 함께 전달
                  }}
                  className="editButton"
                >
                  &#9998;
                </button>
              </td>
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
                text-align: center; /* 텍스트 수평 가운데 정렬 */
                vertical-align: middle; /* 텍스트 수직 가운데 정렬 */
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
        .drivingTable .editButton {
          background-color: transparent; /* 배경색 제거 */
          color: #05aced;
          border: none;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          justify-content: center; /* 아이콘을 flexbox로 수평 가운데 정렬 */
          align-items: center; /* 아이콘을 flexbox로 수직 가운데 정렬 */
          padding: 0;
          transition: color 0.2s;
          margin: 0 0 0 39%;
          transform: scaleX(-1);
        }

        .drivingTable .editButton:hover {
          color: #0398cb;
        }

        /* 반응형 스타일 */
        @media (max-width: 768px) {
          .drivingTable .editButton {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .drivingTable .editButton {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DriveLog;
