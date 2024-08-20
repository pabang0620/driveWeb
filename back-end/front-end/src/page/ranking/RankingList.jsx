import { useState, useEffect } from "react";
import axios from "axios";

const RankingList = ({ title, filterNumber, api_name }) => {
  const [selectedOption, setSelectedOption] = useState("전체");
  const [profiles, setProfiles] = useState([]);

  // 필터 번호에 따라 실제 필터 타입을 설정
  const filterTypeMap = {
    1: "jobtype",
    2: "fuelType",
    3: "carType",
  };

  const filterType = filterTypeMap[filterNumber];

  // 필터 번호에 따른 옵션 설정
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
      try {
        const response = await axios.post(`/api/rank/${api_name}`, {
          filterType,
          filterValue: selectedOption !== "전체" ? selectedOption : undefined,
        });
        setProfiles(response.data);
      } catch (error) {
        console.error(`데이터 요청 중 오류 발생 (${title}):`, error);
      }
    };

    fetchProfiles();
  }, [selectedOption, title, api_name, filterType]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="ranking">
      <div>
        <h3>{title}</h3>
        <select value={selectedOption} onChange={handleSelectChange}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <ul className="profileWrap">
        {profiles.map((profile, index) => (
          <li key={index} className="profile">
            <div className="profilePicture"></div>
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
            select {
              width: 50%;
              padding: 8px 10px;
              font-size: 14px;
              border-radius: 5px;
              border: 1px solid #ccc;
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
              background-color: #ccc;
              margin-right: 10px;
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
