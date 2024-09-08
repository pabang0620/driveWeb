import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 이름 지정된 내보내기로 가져오기

const getToken = () => {
  return localStorage.getItem("token");
};

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

export const getJobtype = () => {
  const token = getToken();
  const decodedToken = jwtDecode(token); // jwt-decode 라이브러리 사용
  const jobtype = decodedToken.jobtype;
  console.log(jobtype);
  return jobtype;
};
export const getUserId = () => {
  const token = getToken();
  const decodedToken = jwtDecode(token); // jwt-decode 라이브러리 사용
  const userId = decodedToken.userId;
  console.log(userId);
  return userId;
};
const getData = async (url) => {
  const token = getToken();
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`조회 실패: ${error.message}`);
  }
};

// 회원정보-개인정보
export const getProfile = async () => {
  return getData("/api/user/profile");
};
// 회원정보-차량정보
export const getProfileVehicle = async () => {
  return getData("/api/user/vehicles");
};
// 회원정보-차량정보-가맹수수료
export const getProfilefranchise = async () => {
  return getData("/api/user/franchise-fee");
};
// 회원정보-소득정보
export const getProfileIncome = async () => {
  return getData("/api/user/income");
};

//운행일지-운행
export const getDrive = async (userId, memo) => {
  const url = userId
    ? `/api/drive/driving-logs/${userId.userId}`
    : `/api/drive/driving-logs`;
  const body = { memo };
  console.log("POST to URL:", url, "with data:", body); // 디버깅을 위한 콘솔 로그

  return postData(url, body);
};

export const getDriveDetails = async (driving_log_id) => {
  return getData(`/api/drive/driving-logs-detail/${driving_log_id}`);
};
//운행일지 - 대쉬보드
export const getDriveDashBoard = async (startDate, endDate) => {
  return getData(`/api/summary/${startDate}/${endDate}`);
};

//마이페이지 - 상단 데이터
export const getMypage = async (startDate, endDate) => {
  return getData(`/api/mypage/${startDate}/${endDate}`);
};
//마이페이지 - 원형데이터 - 지출
export const getMypageIncomeSummary = async (startDate, endDate) => {
  return getData(`/api/mypage/income-summary/${startDate}/${endDate}`);
};
//마이페이지 - 원형데이터 - 수입
export const getMypageExpenseSummary = async (startDate, endDate) => {
  return getData(`/api/mypage/expense-summary/${startDate}/${endDate}`);
};
//마이페이지 - 믹스데이터
export const getMypageMix = async (startDate, endDate) => {
  return getData(`/api/mypage/mixChart/${startDate}/${endDate}`);
};
