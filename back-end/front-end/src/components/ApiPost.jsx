import axios from "axios";

const getToken = () => {
  return localStorage.getItem("token");
};
// 원호 수정
const postData = async (url, data) => {
  const token = getToken();
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`정보 보내기 실패: ${error.message}`);
  }
};
const putData = async (url, data, isFormData = false) => {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  try {
    const response = await axios.put(url, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    // 서버에서 반환된 오류가 505인 경우 처리
    if (error.response && error.response.status === 505) {
      alert("중복된 닉네임입니다."); // 505 오류 시 경고창 출력
    }
    throw new Error(`정보 보내기 실패: ${error.message}`);
  }
};
// ------------------------회원정보-----------------------------
// 회원정보-개인정보
export const postUserProfile = async (formData) => {
  return putData("/api/user/profile", formData, true);
};
// 회원정보-차량정보
export const postProfileVehicle = async (field, value) => {
  const data = { [field]: value };
  return putData("/api/user/vehicles", data);
};
// 회원정보-소득정보
export const postProfileIncome = async (field, value) => {
  const data = { [field]: value };
  return putData("/api/user/income", data);
};
// 회원정보-차량정보-가맹수수료
export const postProfilefranchise = async (data) => {
  return postData("/api/user/franchise-fee", data);
};
// ------------------------운행일지-----------------------------
// 운행일지-일지생성
export const postDrive = async (data) => {
  return postData("/api/drive/log", data);
};
// 운행일지-수입수정
export const postDriveIncome = async (data) => {
  return putData(`/api/drive/income/${data.driving_log_id}`, data);
};
// 운행일지-지출수정
export const postDriveExpense = async (data) => {
  return putData(`/api/drive/expense/${data.driving_log_id}`, data);
};
// ------------------------랭킹-----------------------------
//랭킹-운행시간
export const postRankTopUsers = async (data) => {
  return postData("/api/rank/top-users", data);
};
//랭킹-손익
export const postRankTopNetIncome = async (data) => {
  return postData("/api/rank/top-net-income", data);
};
//랭킹-연비
export const postRankTopFuelEfficiency = async (data) => {
  return postData("/api/rank/top-fuel-efficiency", data);
};
