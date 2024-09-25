import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";
import { jwtDecode } from "jwt-decode";

const RankingList = ({ title, filterNumber, api_name, selectedMonth }) => {
  const [selectedOption, setSelectedOption] = useState("전체");
  const [profiles, setProfiles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPermission, setUserPermission] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserPermission(decodedToken.permission);
    }
  }, []);

  const openModal = (userId) => {
    if ([1, 2, 3, 4].includes(userPermission)) {
      setSelectedUserId(userId);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const filterTypeMap = {
    1: "jobtype",
    2: "fuelType",
    3: "carType",
  };

  const filterType = filterTypeMap[filterNumber];

  let options;
  switch (filterNumber) {
    case 1:
      options = ["전체", "택시", "배달", "기타"];
      break;
    case 2:
      options = ["전체", "LPG", "전기", "휘발유", "경유", "하이브리드"];
      break;
    case 3:
      options = [
        "전체",
        "택시(중형)",
        "택시(대형)",
        "택시(고급)",
        "택시(승합)",
      ];
      break;
    default:
      options = ["전체"];
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      if (selectedMonth) {
        // selectedMonth가 설정된 경우에만 API 요청
        try {
          const response = await axios.post(`/api/rank/${api_name}`, {
            filterType,
            filterValue: selectedOption !== "전체" ? selectedOption : undefined,
            selectedMonth: selectedMonth,
          });
          setProfiles(response.data);
        } catch (error) {
          console.error(`데이터 요청 중 오류 발생 (${title}):`, error);
        }
      }
    };

    fetchProfiles();
  }, [selectedOption, selectedMonth, title, api_name, filterType]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // const handleMonthChange = (event) => {
  //   setSelectedMonth(event.target.value);
  // };

  return (
    <div className="ranking">
      <div>
        <h3>{title}</h3>
        {location.pathname === "/ranking" && (
          <div className="filters">
            <select value={selectedOption} onChange={handleSelectChange}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {/* <select value={selectedMonth} onChange={handleMonthChange}>
                    {[...Array(3)].map((_, index) => {
                      const month = new Date().getMonth() + 1 - (index + 1);
                      const adjustedMonth = month <= 0 ? 12 + month : month;
                      return (
                        <option key={adjustedMonth} value={adjustedMonth}>
                          {adjustedMonth}월
                        </option>
                      );
                    })}
                  </select> */}
          </div>
        )}
      </div>
      <ul className="profileWrap">
        {profiles.map((profile, index) => (
          <li
            key={profile.userId} // 각 프로필의 userId를 key로 사용
            className="profile"
            onClick={() => openModal(profile.id)} // 클릭 시 모달 열기
          >
            {" "}
            <div className="profilePicture">
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt="Profile" />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  color="#c1c1c1"
                  size="3x"
                />
              )}
            </div>
            <p className="profileName">{profile.nickname}</p>
            <p className="profileValue">{profile.value}</p>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <UserInfoModal userId={selectedUserId} onClose={closeModal} />
      )}
      <style jsx>{`
        .ranking {
          min-width: 160px;
          width: 30%;
          margin-bottom: 15px;
          @media (max-width: 768px) {
            width: 100%;
          }
          > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            h3 {
              color: #4c4c4c;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .filters {
              width: 100%;
              justify-content: space-between;
              display: flex;
              margin: 0 0 10px 0;
              gap: 10px;
              select {
                width: 40%;
                padding: 8px 10px;
                font-size: 14px;
                border-radius: 5px;
                border: 1px solid #ccc;
              }
            }
            @media (max-width: 768px) {
              .filters select {
                font-size: 11px;
                padding: 5px 6px;
              }
            }
          }
        }

        .profileWrap {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 10px;
          background-color: #f0f3f5;
          border-radius: 5px;
          min-width: 120px;
          li.profile {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
            margin-bottom: 10px;
            @media (max-width: 768px) {
              padding: 5px 10px;
            }
            .profilePicture {
              width: 35px;
              height: 35px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              @media (max-width: 768px) {
                width: 30px;
                height: 30px;
              }
            }

            .profilePicture img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .profileName {
              font-size: 14px;
              flex-grow: 1;
            }

            .profileValue {
              font-size: 14px;
              color: #555;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default RankingList;
