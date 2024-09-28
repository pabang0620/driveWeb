import React, { useState, useEffect } from "react";
import { getProfilefranchise } from "../../components/ApiGet";
import { postProfilefranchise } from "../../components/ApiPost";
import "./user.scss";

const FranchiseFee = ({ carType, jobtype, status }) => {
  const [franchiseFree, setFranchiseFree] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // 수정 상태 관리
  const [franchiseInfo, setFranchiseInfo] = useState([]); // POST 요청에 사용할 상태

  // 기본적으로 항상 보여줄 항목들 (비가맹일 때도 표시됨)
  const defaultFranchises = ["카드", "기타"];

  const franchises = {
    "택시(중형)": ["카드", "카카오", "우버", "기타"],
    "택시(대형)": ["카드", "카카오", "우버", "기타"],
    "택시(고급)": ["카드", "카카오", "우버", "기타"],
    "택시(승합)": ["카드", "카카오벤티", "아이엠", "기타"],
  };

  const formatFee = (fee) => parseFloat(fee).toFixed(2);

  useEffect(() => {
    const getFranchiseData = async () => {
      try {
        const franchiseData = await getProfilefranchise();
        console.log("겟 수수료 확인:", franchiseData);

        // status가 "가맹"이면 전체 4개의 항목, 그 외에는 기본 항목(카드, 기타)만 표시
        const availableFranchises =
          status === "가맹"
            ? franchises[carType] || [] // 가맹 상태일 경우 차량 종류에 따른 가맹점 목록
            : defaultFranchises; // 비가맹일 경우 카드와 기타만 표시

        // 서버에서 받은 데이터와 가맹점 목록을 매칭
        const initialFranchises = availableFranchises.map((name) => {
          const match = franchiseData.find(
            (item) => item.franchise_name === name
          );
          return {
            id: match ? match.id : undefined, // ID 추가
            franchise_name: name,
            fee: match ? formatFee(match.fee) : "0.00", // 수수료 설정
            checked: match ? true : false, // 가맹 여부에 따라 체크 상태 설정
          };
        });

        setFranchiseFree(initialFranchises);
      } catch (error) {
        console.error("Error fetching franchise data:", error);

        // 서버 호출 실패 시에도 기본적으로 '카드'와 '기타' 항목을 설정
        setFranchiseFree(
          defaultFranchises.map((name) => ({
            franchise_name: name,
            fee: "0.00", // 초기값 설정
            checked: false, // 기본적으로 선택되지 않음
          }))
        );
      }
    };

    getFranchiseData();
  }, [carType, jobtype, status]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveFranchiseInfo();
    }
    setIsEditing(!isEditing); // 수정 버튼 클릭 시 상태 토글
  };

  const handleFranchiseChange = (index, field, value) => {
    const updatedFranchiseFree = [...franchiseFree];
    updatedFranchiseFree[index] = {
      ...updatedFranchiseFree[index],
      [field]: value,
    };
    setFranchiseFree(updatedFranchiseFree);
  };

  const handleFeeChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, ""); // 숫자 및 소수점만 허용
    handleFranchiseChange(index, "fee", numericValue);
  };

  const handleFeeBlur = (index, value) => {
    const formattedValue = value ? parseFloat(value).toFixed(2) : "0.00"; // 포맷
    handleFranchiseChange(index, "fee", formattedValue);
  };

  const handleSaveFranchiseInfo = async () => {
    try {
      // 선택된 가맹 정보만 필터링해서 저장
      const selectedFranchises = franchiseFree
        .filter((item) => item.checked === true && item.fee !== "0.00")
        .map((item) => ({
          id: item.id, // ID 포함
          franchise_name: item.franchise_name,
          fee: item.fee,
        }));

      console.log("Selected Franchises to Save:", selectedFranchises);
      setFranchiseInfo(selectedFranchises);

      // POST 요청으로 가맹 정보 전송
      await postProfilefranchise({ franchise_info: selectedFranchises });
      console.log("가맹 정보 저장 성공!");
    } catch (error) {
      console.error("가맹 정보 저장 실패:", error.message);
    }
  };

  return (
    franchiseFree.length > 0 && (
      <div className="checkboxes">
        <label>수수료율 설정</label>
        <div className="franchise-list">
          {franchiseFree.map((item, index) => (
            <div key={index} className="franchise-item">
              <input
                type="checkbox"
                checked={item.checked}
                disabled={!isEditing}
                value={item.franchise_name}
                onChange={(e) =>
                  handleFranchiseChange(index, "checked", e.target.checked)
                }
              />
              <p>{item.franchise_name}</p>
              <input
                type="text"
                value={item.fee}
                onChange={(e) => handleFeeChange(index, e.target.value)}
                onBlur={(e) => handleFeeBlur(index, e.target.value)}
                disabled={!isEditing}
                style={{ width: "50px" }}
              />
              %
            </div>
          ))}
        </div>
        <button
          onClick={handleEditToggle}
          className={isEditing ? "savebtn" : "editBtn"}
        >
          {isEditing ? "저장" : "수정"}
        </button>
      </div>
    )
  );
};

export default FranchiseFee;
