import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";
import { jwtDecode } from "jwt-decode";
import "./ranking.scss";

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
    </div>
  );
};

export default RankingList;
