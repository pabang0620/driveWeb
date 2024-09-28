import React, { useEffect, useState, useRef } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getProfile } from "../../components/ApiGet";
import { postUserProfile } from "../../components/ApiPost";
import { validatePhone, validateEmail } from "../../components/Validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";
import useCheckPermission from "../../utils/useCheckPermission";
import JobTypeComponent from "./JobTypeComponent";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ResetPasswordModal from "../login/ResetPasswordModal";
import "./user.scss";

const PersonalInfo = () => {
  useCheckPermission();
  const [expireDate, setExpireDate] = useState("");
  const [jobtype, setJobtype] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getJobtype = () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const jobtype = decodedToken.jobtype;
    setJobtype(jobtype);
  };

  const openPasswordModal = () => {
    setShowModal(true);
  };
  const [userInfo, setUserInfo] = useState({
    name: "test",
    birth_date: "",
    phone: "",
    email: "",
    imageUrl: "",

    googleId: undefined,
    kakaoId: undefined,
    naverId: undefined,
    users: {
      // users 객체 초기화
      nickname: "",
    },
  });

  const [prevUserInfo, setPrevUserInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const fileInputRef = useRef(null);

  const fetchExpirationDate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpireDate(response.data.expirationDate);
    } catch (error) {
      console.error("Error fetching date:", error);
    }
  };
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getProfile();
        setUserInfo(data);
        setPrevUserInfo(data); // 초기 사용자 정보를 설정합니다.
        setImagePreview(data.imageUrl);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); // 데이터 로딩 후 로딩 상태 해제
      }
    };

    // 토큰이 있는지 확인
    const token = localStorage.getItem("token"); // 또는 sessionStorage 사용 가능
    if (token) {
      // 토큰이 있을 때만 getUserData와 getJobtype 호출
      getUserData();
      getJobtype();
      fetchExpirationDate();
    }
  }, []);

  // 직종 수정
  const updateJobType = async (newJobType) => {
    // 사용자에게 변경 확인 요청
    const confirmChange = window.confirm("정말 업종을 변경하시겠습니까?");

    if (confirmChange) {
      try {
        const response = await axios.put(
          "/api/user/jobtype",
          { jobType: newJobType },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // 로컬 스토리지에서 토큰 가져오기
            },
          }
        );

        localStorage.setItem("token", response.data.token); // 새 토큰을 로컬 스토리지에 저장
        alert("업종이 변경되었습니다. 재로그인 시 반영됩니다."); // 성공 메시지
      } catch (error) {
        console.error("Failed to update job type:", error);
        alert("업종 업데이트에 실패하였습니다.");
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    } else {
      alert("수정 버튼을 누르고 이미지 삽입 후 저장을 눌러주세요.");
    }
  };

  const handleDeleteImage = () => {
    if (isEditing) {
      const confirmDelete = window.confirm("이미지를 삭제하시겠습니까?");
      if (confirmDelete) {
        setProfileImage(null);
        setImagePreview(null);
        setUserInfo((prevState) => ({
          ...prevState,
          imageUrl: "", // 이미지 URL을 빈 값으로 설정
        }));
      }
    } else {
      alert("수정 버튼을 누르고 이미지 삭제 후 저장을 눌러주세요.");
    }
  };

  const handleSaveUserInfo = async () => {
    try {
      if (
        userInfo.phone !== prevUserInfo.phone &&
        !validatePhone(userInfo.phone)
      ) {
        alert("유효한 휴대폰 번호 형식이 아닙니다.");
        return;
      }
      if (
        userInfo.email !== prevUserInfo.email &&
        !validateEmail(userInfo.email)
      ) {
        alert("유효한 이메일 형식이 아닙니다.");
        return;
      }

      const formData = new FormData();
      if (userInfo.name !== prevUserInfo.name)
        formData.append("name", userInfo.name);
      if (userInfo.birth_date !== prevUserInfo.birth_date)
        formData.append("birth_date", userInfo.birth_date);
      if (userInfo.phone !== prevUserInfo.phone)
        formData.append("phone", userInfo.phone);
      if (userInfo.email !== prevUserInfo.email)
        formData.append("email", userInfo.email);
      if (userInfo.imageUrl !== prevUserInfo.imageUrl)
        formData.append("imageUrl", userInfo.imageUrl);
      if (profileImage) {
        formData.append("image", profileImage);
      } else if (userInfo.imageUrl === "") {
        formData.append("image", ""); // 이미지가 없을 때 빈 값으로 처리
      }

      // 닉네임 변경 여부 확인 및 추가
      if (userInfo.users.nickname !== prevUserInfo.users.nickname) {
        formData.append("nickname", userInfo.users.nickname);
      }
      await postUserProfile(formData);
      setPrevUserInfo(userInfo); // 변경된 값을 prevUserInfo에 저장합니다.
      console.log("회원 정보 저장 성공!");
    } catch (error) {
      console.error("회원 정보 저장 실패:", error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo((prevState) => {
      if (field === "nickname") {
        // users 객체의 nickname 값을 변경
        return {
          ...prevState,
          users: {
            ...prevState.users,
            nickname: value,
          },
        };
      }
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    handleSaveUserInfo();
  };

  const [socialStatus, setSocialStatus] = useState("");

  useEffect(() => {
    let images = [];
    if (userInfo.googleId)
      images.push(`${process.env.PUBLIC_URL}/images/googlelogo.png`);
    if (userInfo.kakaoId)
      images.push(`${process.env.PUBLIC_URL}/images/kakaologo.png`);
    if (userInfo.naverId)
      images.push(`${process.env.PUBLIC_URL}/images/naverlogo.png`);

    setSocialStatus(images);
  }, [userInfo]);

  if (loading) {
    return <Spinner />; // 로딩 중일 때 스피너 표시
  }
  if (jobtype === null) {
    // 차량 종류가 비어있을 경우 메시지 표시
    return <JobTypeComponent />;
  }

  // 날짜를 "YYYY년 MM월 DD일" 형식으로 변환하는 함수
  const formatExpirationDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options); // 한국어 형식으로 변환
  };

  return (
    <div className="container userInfo">
      <TitleBox title="회원정보" subtitle="개인정보" />
      <div className="userInfoImgBox">
        {imagePreview ? (
          <div className="imageWrapper">
            <img src={imagePreview} alt="Profile" onClick={handleImageClick} />
            {isEditing && (
              <FontAwesomeIcon
                icon={faTrashAlt}
                size="lg"
                color="red"
                onClick={handleDeleteImage}
                className="deleteIcon"
              />
            )}
          </div>
        ) : (
          <FontAwesomeIcon
            onClick={handleImageClick}
            icon={faUserCircle}
            size="8x"
            color="#c1c1c1"
            className="userIcon"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className="buttonWrap">
          {isEditing ? (
            <button onClick={handleSaveClick} className="savebtn">
              저장
            </button>
          ) : (
            <button onClick={handleEditClick} className="editbtn">
              수정
            </button>
          )}
        </div>
      </div>
      <div className="content">
        <div className="inputWrap">
          <h3>업종을 선택해주세요</h3>
          <div className="button-group">
            <button
              onClick={() => updateJobType(1)}
              className={jobtype === 1 ? "active" : ""}
            >
              택시
            </button>
            <button
              onClick={() => updateJobType(2)}
              className={jobtype === 2 ? "active" : ""}
            >
              배달
            </button>
            <button
              onClick={() => updateJobType(3)}
              className={jobtype === 3 ? "active" : ""}
            >
              기타
            </button>
          </div>
          <h3>기본정보</h3>
          <DynamicInput
            labelName={"닉네임"}
            inputType={"text"}
            value={userInfo.users.nickname}
            fieldName="nickname"
            onChange={handleInputChange}
            placeholder={"닉네임을 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
            isEditing={isEditing}
          />
          <DynamicInput
            labelName={"이름"}
            inputType={"text"}
            value={userInfo.name}
            fieldName="name"
            onChange={handleInputChange}
            placeholder={"이름을 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
            isEditing={isEditing}
          />
          <DynamicInput
            labelName={"생년월일"}
            inputType={"text"}
            value={userInfo.birth_date}
            fieldName="birth_date"
            onChange={handleInputChange}
            placeholder={"생년월일을 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
            isEditing={isEditing}
          />
        </div>
        <div className="inputWrap">
          <h3>연락처 정보</h3>
          <DynamicInput
            labelName={"휴대폰"}
            inputType={"text"}
            value={userInfo.phone}
            fieldName="phone"
            onChange={handleInputChange}
            placeholder={"휴대폰 번호를 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
            isEditing={isEditing}
          />
          <DynamicInput
            labelName={"이메일"}
            inputType={"text"}
            value={userInfo.email}
            fieldName="email"
            onChange={handleInputChange}
            placeholder={"이메일을 입력해주세요."}
            onSave={handleSaveUserInfo}
            showEditButton={true}
            isEditing={isEditing}
          />
          {expireDate && (
            <div className="expiration_date_container">
              <p>
                프리미엄 서비스 만료일 :
                <strong> {formatExpirationDate(expireDate)}</strong>
              </p>
            </div>
          )}
          <div className="socialMark">
            {socialStatus.map((image, index) => (
              <img key={index} src={image} alt="Social Logo" />
            ))}
          </div>{" "}
        </div>
        <div className="password-change-btn" onClick={openPasswordModal}>
          비밀번호 변경
        </div>

        {showModal && (
          <ResetPasswordModal
            username={userInfo.email}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      <style jsx>{`
        .expiration_date_container {
          font-size: 18px;
          color: #333;
          margin: 20px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          text-align: center;
          background-color: #f9f9f9;
        }
        p {
          font-size: 20px;
        }
        strong {
          color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default PersonalInfo;
