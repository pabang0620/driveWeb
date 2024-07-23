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
const putData = async (url, data) => {
  const token = getToken();
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`정보 보내기 실패: ${error.message}`);
  }
};
// ------------------------회원정보-----------------------------
// 회원정보-개인정보
export const postUserProfile = async (field, value) => {
  const data = { [field]: value };
  return putData("/api/user/profile", data);
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
  return putData("/api/user/franchise-fee", data);
};
// ------------------------운행일지-----------------------------
// 운행일지-일지생성
export const postDrive = async (data) => {
  return putData("/api/drive/log", data);
};
// 운행일지-수입수정
export const postDriveIncome = async (data) => {
  return putData(`/api/drive/income/${data.drivingLogId}`, data);
};
// 운행일지-지출수정
export const postDriveExpense = async (data) => {
  return putData(`/api/drive/expense/${data.drivingLogId}`, data);
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
