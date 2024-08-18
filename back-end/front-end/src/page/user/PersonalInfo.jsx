import React, { useEffect, useState, useRef } from "react";
import { DynamicInput } from "../../components/InputBox";
import { getProfile, getJobtype } from "../../components/ApiGet";
import { postUserProfile } from "../../components/ApiPost";
import { validatePhone, validateEmail } from "../../components/Validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Spinner"; // 로딩 스피너 컴포넌트 경로에 맞게 수정하세요
import TitleBox from "../../components/TitleBox";

const PersonalInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "test",
    birth_date: "",
    phone: "",
    email: "",
    imageUrl: "",
  });
  const [prevUserInfo, setPrevUserInfo] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        getJobtype();
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
    getUserData();
  }, []);

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

      await postUserProfile(formData);
      setPrevUserInfo(userInfo); // 변경된 값을 prevUserInfo에 저장합니다.
      console.log("회원 정보 저장 성공!");
    } catch (error) {
      console.error("회원 정보 저장 실패:", error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    handleSaveUserInfo();
  };

  if (loading) {
    return <Spinner />; // 로딩 중일 때 스피너 표시
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
          <h3>기본정보</h3>
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
        </div>
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
