import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 이름 지정된 내보내기로 가져오기

const getToken = () => {
  return localStorage.getItem("token");
};

export const getJobtype = () => {
  const token = getToken();
  const decodedToken = jwtDecode(token); // jwt-decode 라이브러리 사용
  const jobtype = decodedToken.jobtype;
  console.log(jobtype);
  return jobtype;
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
    throw new Error(`회원 정보 조회 실패: ${error.message}`);
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
export const getDrive = async () => {
  return getData("/api/drive");
};
