import React, { useState, useEffect } from "react";
import { getProfilefranchise } from "../../components/ApiGet";
import { postProfilefranchise } from "../../components/ApiPost";

const FranchiseFee = ({ carType, jobtype }) => {
  const [franchiseFree, setFranchiseFree] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // 수정 상태 관리
  const [franchiseInfo, setFranchiseInfo] = useState([]); // POST 요청에 사용할 상태

  const franchises = {
    "택시(중형)": ["카카오", "우버", "온다", "타다", "기타"],
    "택시(대형)": ["카카오", "우버", "온다", "타다", "기타"],
    "택시(고급)": ["카카오", "우버", "온다", "타다", "기타"],
    "택시(승합)": ["카카오벤티", "아이엠", "기타"],
  };

  useEffect(() => {
    const getFranchiseData = async () => {
      try {
        const franchiseData = await getProfilefranchise();
        console.log("겟 수수료 확인:", franchiseData);

        const availableFranchises = franchises[carType] || [];
        const initialFranchises = availableFranchises.map((name) => {
          const match = franchiseData.find(
            (item) => item.franchise_name === name
          );
          return {
            id: match ? match.id : undefined, // id 추가
            franchise_name: name,
            fee: match ? match.fee : 0,
            checked: match ? true : false,
          };
        });

        if (initialFranchises.length === 0) {
          setFranchiseFree(
            availableFranchises.map((name) => ({
              franchise_name: name,
              fee: 0,
              checked: false,
            }))
          );
        } else {
          setFranchiseFree(initialFranchises);
        }
      } catch (error) {
        console.error("Error fetching franchise data:", error);
        setFranchiseFree(
          franchises[carType].map((name) => ({
            franchise_name: name,
            fee: 0,
            checked: false,
          }))
        );
      }
    };

    getFranchiseData();
  }, [carType, jobtype]);

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
      [field]: field === "checked" ? value : value,
    };
    console.log("Updated Franchise Free:", updatedFranchiseFree); // 콘솔에 업데이트된 상태 출력
    setFranchiseFree(updatedFranchiseFree);
  };

  const handleSaveFranchiseInfo = async () => {
    try {
      // 선택된 가맹 정보만 필터링해서 franchise_info 상태에 저장
      const selectedFranchises = franchiseFree
        .filter((item) => item.checked === true && item.fee !== 0)
        .map((item) => ({
          id: item.id, // id 포함
          franchise_name: item.franchise_name,
          fee: item.fee,
        }));

      console.log("Selected Franchises to Save:", selectedFranchises); // 콘솔에 페이로드 출력
      setFranchiseInfo(selectedFranchises);

      // franchise_info 상태를 POST 요청으로 보내기
      await postProfilefranchise({ franchise_info: selectedFranchises });
      console.log("가맹 정보 저장 성공!");
    } catch (error) {
      console.error("가맹 정보 저장 실패:", error.message);
    }
  };

  return (
    franchiseFree.length > 0 && (
      <div className="checkboxes">
        <label>가맹 항목</label>
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
                type="number"
                value={item.fee}
                onChange={(e) =>
                  handleFranchiseChange(index, "fee", e.target.value)
                }
                disabled={!isEditing}
                style={{ width: "50px" }} // 숫자 입력창 크기 줄이기
              />
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
