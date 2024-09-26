import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./ranking.scss";

const UserInfoModal = ({ userId, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`/api/rank/userinfo/${userId}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error("사용자 정보 요청 중 오류 발생:", error);
        }
      };

      fetchUserInfo();
    }
  }, [userId]);

  if (!userInfo) return null;

  // 지역 정보를 포맷팅하는 함수
  const formatLocation = (location) => {
    if (!location) return "정보 없음";
    return location;
  };

  // 지역 정보를 합쳐서 표시하는 함수
  const formatFullLocation = () => {
    const location1 = formatLocation(userInfo.region1);
    const location2 = formatLocation(userInfo.region2);
    return location1 && location2
      ? ` ${location1} ${location2}`
      : ` ${location1 || location2 || "정보 없음"}`;
  };

  return (
    <div className="userRankmodal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          ×
        </span>
        <div className="profile-header">
          <div className="profilePicture">
            {userInfo.profileImageUrl ? (
              <img src={userInfo.profileImageUrl} alt="Profile" />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} color="#c1c1c1" size="3x" />
            )}
          </div>
          <h2>{userInfo.nickname}</h2>
        </div>
        <div className="user-details">
          <div className="detail-item">
            <p>수입 유형:</p>
            <p>{userInfo.incomeType || "정보 없음"}</p>
          </div>
          <div className="detail-item">
            <p>지역:</p>
            <p>{formatFullLocation()}</p>
          </div>
          <div className="detail-item">
            <p>차량 유형:</p>
            <p>{userInfo.carType || "정보 없음"}</p>
          </div>
          <div className="detail-item">
            <p>가맹점 상태:</p>
            <p>{userInfo.franchiseStatus || "정보 없음"}</p>
          </div>
          <div className="detail-item">
            <p>차량 이름:</p>
            <p>{userInfo.vehicleName || "정보 없음"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
