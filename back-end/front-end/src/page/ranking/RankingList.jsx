import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const RankingList = ({ title, filterNumber, api_name }) => {
  const [selectedOption, setSelectedOption] = useState("전체");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // 현재 날짜 기준으로 지난달을 기본 값으로 설정
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    setSelectedMonth(lastMonth);
  }, []);

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
      options = [
        "전체",
        "LPG",
        "전기",
        "휘발유",
        "경유",
        "하이브리드",
        "천연가스",
        "수소",
        "바이오디젤",
        "에탄올",
        "기타",
      ];
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
        // selectedMonth가 설정된 경우에만 요청 보냄
        try {
          const response = await axios.post(`/api/rank/${api_name}`, {
            filterType,
            filterValue: selectedOption !== "전체" ? selectedOption : undefined,
            selectedMonth: selectedMonth, // 선택한 월을 API 요청에 포함
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="ranking">
      <div>
        <h3>{title}</h3>
        <div className="filters">
          <select value={selectedOption} onChange={handleSelectChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {[...Array(3)].map((_, index) => {
              const month = new Date().getMonth() + 1 - (index + 1);
              const adjustedMonth = month <= 0 ? 12 + month : month;
              return (
                <option key={adjustedMonth} value={adjustedMonth}>
                  {adjustedMonth}월
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <ul className="profileWrap">
        {profiles.map((profile, index) => (
          <li key={index} className="profile">
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

      <style jsx>{`
        .ranking {
          width: 30%;
          margin-bottom: 15px;
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
          }
        }

        .profileWrap {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 10px;
          background-color: #f0f3f5;
          border-radius: 5px;
          li.profile {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
            margin-bottom: 10px;

            .profilePicture {
              width: 35px;
              height: 35px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
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
