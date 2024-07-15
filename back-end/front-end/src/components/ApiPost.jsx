import axios from "axios";

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
    throw new Error(`회원 정보 보내기 실패: ${error.message}`);
  }
};

// 회원정보-개인정보
export const postUserProfile = async (field, value) => {
  const data = { [field]: value };
  return postData("/api/user/profile", data);
};

// 회원정보-차량정보
export const postProfileVehicle = async (field, value) => {
  const data = { [field]: value };
  return postData("/api/user/vehicles", data);
};

// 회원정보-차량정보-가맹수수료
export const postProfilefranchise = async (data) => {
  return postData("/api/user/franchise-fee", data);
};

// 회원정보-소득정보
export const postProfileIncome = async (field, value) => {
  const data = { [field]: value };
  return postData("/api/user/income", data);
};

// 운행일지-운행
export const postDrive = async (data) => {
  return postData("/api/user/income", data);
};
