import React, { useEffect, useState, useRef } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getProfile } from "../../components/ApiGet";
import { postUserProfile } from "../../components/ApiPost";
import { validatePhone, validateEmail } from "../../components/Validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Spinner"; // 로딩 스피너 컴포넌트 경로에 맞게 수정하세요
import TitleBox from "../../components/TitleBox";
import useCheckPermission from "../../utils/useCheckPermission";
import JobTypeComponent from "./JobTypeComponent";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 잘못된 임포트, 'jwt-decode'를 한 번만 작성해야 함
import ResetPasswordModal from "../login/ResetPasswordModal";

const PersonalInfo = () => {
  useCheckPermission();

  const [jobtype, setJobtype] = useState(""); // 잡타입 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태 추가

  const getJobtype = () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token); // jwt-decode 라이브러리 사용
    const jobtype = decodedToken.jobtype;
    setJobtype(jobtype);
  };

  const openPasswordModal = () => {
    setShowModal(true); // 보안 질문과 답변이 일치하면 모달 표시
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

  console.log(userInfo.users.nickname); // 수정된 부분
  const [prevUserInfo, setPrevUserInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const fileInputRef = useRef(null);

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
    }
  }, []);

  // 직종 수정
  const updateJobType = async (newJobType) => {
    // 사용자에게 변경 확인 요청
    const confirmChange = window.confirm("정말 직종을 변경하시겠습니까?");

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
        alert("직종이 변경되었습니다."); // 성공 메시지
      } catch (error) {
        console.error("Failed to update job type:", error);
        alert("직종 업데이트에 실패하였습니다.");
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
        .userInfo {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
          .button-group {
            margin-bottom: 30px;
          }
          .button-group button {
            padding: 10px 20px;
            margin: 5px;
            font-size: 16px;
            cursor: pointer;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s, color 0.3s;
          }

          .button-group button:hover {
            background-color: #0056b3;
            color: white;
          }
          .button-group button.active {
            background-color: #0056b3;
            color: white;
          }

          h2 {
            font-size: 25px;
            font-weight: 600;
            span {
              font-size: 20px;
              color: #4c4c4c;
              margin-left: 10px;
            }
          }
          .userInfoImgBox {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
            @media (max-width: 768px) {
              margin-top: 20px;
              margin-bottom: 20px;
            }
            svg {
              @media (max-width: 768px) {
                width: 100px;
                aspect-ratio: 1/1;
              }
            }
            .imageWrapper {
              position: relative;
              img {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                margin-bottom: 10px;
                cursor: pointer;
              }

              .userIcon {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                margin-top: 10px;
                margin-bottom: 10px;
                cursor: pointer;
              }
              .deleteIcon {
                width: 20px;
                height: 20px;
                position: absolute;
                bottom: 18px;
                right: 5px;
                cursor: pointer;
                color: red;
              }
            }
          }
          .inputWrap {
            margin-top: 30px;
            position: relative;
            .socialMark {
              position: absolute;
              bottom: 9px;
              left: -25px;

              img {
                width: 20px;
                height: 20px;
              }
            }
          }
          h3 {
            font-size: 16px;
            color: #4c4c4c;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .dynamicInput {
            border-bottom: 1px solid #c1c1c1;
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            label {
              font-size: 14px;
              color: #c1c1c1;
              width: 15%;
              @media (max-width: 768px) {
                width: 25%;
              }
            }
            input {
              font-size: 14px;
              color: #c1c1c1;
              border: none;
              width: 75%;
              margin-right: 5%;
              height: 100%;
              text-align: left;
              background: none;
              &:focus {
                border: none;
                outline: none;
                color: #222;
              }
            }
            button {
              margin-left: auto;
              cursor: pointer;
              font-size: 14px;
              border: 1px solid #4c4c4c;
              color: #4c4c4c;
              border-radius: 5px;
              width: 40px;
              height: 25px;
              text-align: center;
              &.savebtn {
                border-color: rgb(100 255 0);
                color: rgb(100 255 0);
              }
            }
          }
          .password-change-btn {
            margin: 40px 0px;
            display: inline-block;
            background-color: #007bff; /* 파란색 배경 */
            color: white; /* 텍스트 색상 */
            padding: 12px 24px; /* 적당한 패딩 */
            font-size: 16px; /* 글씨 크기 */
            font-weight: bold; /* 굵은 글씨 */
            border-radius: 8px; /* 둥근 모서리 */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
            cursor: pointer; /* 클릭 가능 커서 */
            transition: background-color 0.3s ease, transform 0.2s ease; /* 배경색과 클릭 시 애니메이션 */
          }

          .password-change-btn:hover {
            background-color: #0056b3; /* 호버 시 더 어두운 파란색 */
            transform: translateY(-2px); /* 살짝 올라가는 애니메이션 */
          }

          .password-change-btn:active {
            background-color: #004085; /* 클릭 시 더 어두운 색 */
            transform: translateY(0); /* 클릭 시 원래 위치로 */
          }
          .buttonWrap {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            @media (max-width: 768px) {
              margin-top: 10px;
            }
            button {
              cursor: pointer;
              font-size: 14px;
              border: 1px solid #4c4c4c;
              color: #4c4c4c;
              border-radius: 5px;
              width: 80px;
              height: 30px;
              text-align: center;
              &.savebtn {
                border-color: rgb(100 255 0);
                color: rgb(100 255 0);
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalInfo;
