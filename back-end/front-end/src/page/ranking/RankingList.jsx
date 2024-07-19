import { useState, useEffect } from "react";
import {
  postRankTopUsers,
  postRankTopNetIncome,
  postRankTopFuelEfficiency,
} from "../../components/ApiPost";

const Ranking = ({ title, options, rankType }) => {
  const [selectedOption, setSelectedOption] = useState("1");
  const [profiles, setProfiles] = useState([
    {
      id: "1",
      nickname: "김운전자",
      totalDrivingTime: 120, // 총 운전 시간(분)
    },
    {
      id: "2",
      nickname: "이운전자",
      totalDrivingTime: 98,
    },
    {
      id: "3",
      nickname: "박운전자",
      totalDrivingTime: 76,
    },
    {
      id: "4",
      nickname: "최운전자",
      totalDrivingTime: 54,
    },
    {
      id: "5",
      nickname: "정운전자",
      totalDrivingTime: 32,
    },
  ]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        let response;
        switch (rankType) {
          case "jobType":
            response = await postRankTopUsers(selectedOption);
            setProfiles(response.data);
            break;
          case "carType":
            response = await postRankTopNetIncome(selectedOption);
            setProfiles(response.data);
            break;
          case "fuelType":
            response = await postRankTopFuelEfficiency(selectedOption);
            setProfiles(response.data);
            break;
          default:
            throw new Error("알 수 없는 API 타입입니다.");
        }
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
          margin-bottom: 50px;
          > div {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 20px;
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
            li {
              background-color: white;
              border: 1px solid #d9d9d9;
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              border-radius: 5px;
              padding: 10px;
              .profilePicture {
                width: 40px;
                height: 40px;
                background-color: gold;
                border-radius: 50%;
              }
              .profileName {
                font-size: 14px;
              }
              .profileValue {
                font-size: 12px;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Ranking;
