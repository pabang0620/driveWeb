import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

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

      <style jsx>{`
        .userRankmodal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in;

          .modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            position: relative;
            animation: slideIn 0.3s ease-out;
            border: 1px solid #ddd;
          }

          .close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 24px;
            color: #666;
          }

          .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
            background: #f7f7f7;
            padding: 15px;
            border-radius: 8px;
          }

          .profilePicture {
            display: flex;
            justify-content: center;
          }

          img {
            max-width: 80px;
            border-radius: 50%;
            border: 3px solid #eee;
          }

          h2 {
            font-size: 22px;
            color: #333;
          }

          .user-details {
            display: flex;
            flex-direction: column;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 20px;
            border-bottom: 1px solid #eee;
            background: #f9f9f9;
            border-radius: 4px;
          }

          .detail-item p {
            margin: 0;
            font-size: 16px;
            color: #555;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @media (max-width: 768px) {
            .modal-content {
              width: 95%;
              max-width: none;
            }

            .profile-header {
              flex-direction: column;
              align-items: center;
            }

            img {
              max-width: 60px;
            }

            h2 {
              font-size: 20px;
            }

            .detail-item {
              flex-direction: column;
              align-items: flex-start;
              padding: 10px 5px;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default UserInfoModal;
