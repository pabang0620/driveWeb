import { useState, useEffect } from "react";
import {
  postRankTopUsers,
  postRankTopNetIncome,
  postRankTopFuelEfficiency,
} from "../../components/ApiPost";
import { fuelType, carType, jobType } from "../../components/dummy";
const RankingList = ({ title, rankType }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [profiles, setProfiles] = useState([]);

  // rankType에 따라 options을 설정
  let options;
  switch (rankType) {
    case "jobType":
      options = ["전체", "택시", "배달", "기타"];
      break;
    case "carType":
      options = ["전체"];
      break;
    case "fuelType":
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
    default:
      options = [];
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        let response;
        switch (rankType) {
          case "jobType":
            response = await postRankTopUsers({ jobtype: selectedOption });
            break;
          case "carType":
            response = await postRankTopNetIncome({ carType: selectedOption });
            break;
          case "fuelType":
            response = await postRankTopFuelEfficiency({
              fuelType: selectedOption,
            });
            break;
          default:
            throw new Error("알 수 없는 API 타입입니다.");
        }
        switch (rankType) {
          case "jobType":
            response = jobType; // 더미 데이터로 교체
            break;
          case "carType":
            response = carType; // 더미 데이터로 교체
            break;
          case "fuelType":
            response = fuelType; // 더미 데이터로 교체
            break;
          default:
            throw new Error("알 수 없는 API 타입입니다.");
        }
        setProfiles(response);
      } catch (error) {
        console.error("데이터 요청 중 오류 발생:", error);
      }
    };

    fetchProfiles();
  }, [selectedOption, rankType]);

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
            <p>{index + 1}</p>
            <div className="profilePicture"></div>
            <p className="profileName">{profile.nickname}</p>
            {rankType === "jobType" && (
              <p className="profileValue">{profile.totalDrivingTime}분</p>
            )}
            {rankType === "carType" && (
              <p className="profileValue">{profile.netIncome} 원</p>
            )}
            {rankType === "fuelType" && (
              <p className="profileValue">{profile.fuelEfficiency} km/L</p>
            )}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .ranking {
          width: 30%;
          @media (max-width: 1024px) {
            width: 48%;
            margin-bottom: 15px;
          }
          @media (max-width: 767px) {
            width: 100%;
            margin-bottom: 15px;
          }
          > div {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 20px;
            @media (max-width: 768px) {
              margin-bottom: 10px;
            }
            h3 {
              color: #4c4c4c;
              font-size: 16px;
            }
            select {
              width: 30%;
              color: #505050;
              border: 1px solid #c1c1c1;
              font-size: 14px;
              border-radius: 5px;
              padding: 3px 5px;
            }
          }

          ul.profileWrap {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 5%;
            gap: 10px;
            background-color: #f0f3f5;
            border-radius: 5px;
            @media (max-width: 768px) {
              gap: 5px;
              padding: 3%;
            }
            li {
              background-color: white;
              border: 1px solid #d9d9d9;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              align-items: center;
              gap: 5%;
              width: 100%;
              border-radius: 5px;
              padding: 10px;

              .profilePicture {
                width: 35px;
                aspect-ratio: 1/1;
                background-color: gold;
                border-radius: 50%;
              }
              .profileName {
                font-size: 14px;
              }

              .profileValue {
                font-size: 12px;
                margin-left: auto;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default RankingList;
