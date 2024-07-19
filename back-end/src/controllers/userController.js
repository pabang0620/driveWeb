const {
  createUser,
  findUserByUsername,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
  deleteFranchiseFee,
  updateFranchiseFee,
  createFranchiseFee,
  getUserProfile,
  createUserProfile,
  getUserIncomeRecords,
  getUserVehiclesWithFees,
  createUserIncome,
  addUserVehicle,
  getFranchiseFees,
  updateUserProfileData,
  updateUserIncomeData,
  updateUserVehicle,
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const registerUser = async (req, res) => {
  const { nickname, username, password, jobtype } = req.body;
  if (!nickname || !username || !password || !jobtype) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(nickname, username, hashedPassword, jobType);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "사용자 생성 중 오류가 발생했습니다." });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
  }
  try {
    const user = await findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: "잘못된 이메일 또는 비밀번호입니다." });
    }

    // console.log("username", username);
    // console.log("user", user);

    const token = jwt.sign(
      { userId: user.id, jobtype: user.jobtype }, // jobtype을 토큰의 페이로드에 추가
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // console.log(token);
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: "일반 로그인 중 오류가 발생했습니다." });
  }
};

const socialLogin = async (req, res, provider) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "토큰이 필요합니다." });
  }

  try {
    let userData;
    if (provider === "google") {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
      );
      userData = {
        id: response.data.sub,
        name: response.data.name,
        username: response.data.username,
      };
    } else if (provider === "kakao") {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      userData = {
        id: response.data.id,
        name: response.data.properties.nickname,
        username: response.data.kakao_account.username,
      };
    } else if (provider === "naver") {
      const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      userData = {
        id: response.data.response.id,
        name: response.data.response.name,
        username: response.data.response.username,
      };
    }

    const { id, name, username } = userData;
    let user;
    if (provider === "google") {
      user = await findUserByGoogleId(id);
    } else if (provider === "kakao") {
      user = await findUserByKakaoId(id);
    } else if (provider === "naver") {
      user = await findUserByNaverId(id);
    }

    if (!user) {
      user = await createUser(
        name,
        username,
        null,
        provider === "google" ? id : null,
        provider === "kakao" ? id : null,
        provider === "naver" ? id : null
      );
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
  }
};

const googleLogin = (req, res) => socialLogin(req, res, "google");
const kakaoLogin = (req, res) => socialLogin(req, res, "kakao");
const naverLogin = (req, res) => socialLogin(req, res, "naver");

const updateUserProfile = async (req, res) => {
  const { userId } = req;
  const profileData = req.body;
  console.log(profileData);
  try {
    const profile = await updateUserProfileData(userId, profileData);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "프로필 업데이트 중 오류가 발생했습니다." });
  }
};

const updateUserVehicleHandler = async (req, res) => {
  const { userId } = req;
  const {
    carType,
    franchise_status,
    commission_rate,
    vehicle_name,
    year,
    fuel_type,
    mileage,
  } = req.body;

  try {
    const vehicle = await updateUserVehicle(userId, {
      carType,
      franchise_status,
      commission_rate,
      vehicle_name,
      year,
      fuel_type,
      mileage,
    });

    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({ error: "차량 정보를 업데이트하는 중 오류가 발생했습니다." });
  }
};

const updateUserIncome = async (req, res) => {
  const { userId } = req;
  const incomeData = req.body;

  try {
    const income = await updateUserIncomeData(userId, incomeData);
    res.status(200).json(income);
  } catch (error) {
    res
      .status(500)
      .json({ error: "소득 정보 업데이트 중 오류가 발생했습니다." });
  }
};

// 수수료 등록 수정 삭제 컨트롤러
const addFranchiseFee = async (req, res) => {
  const { id: userId } = req;
  const { franchise_name, fee } = req.body;
  console.log(id);

  try {
    const franchiseFee = await createFranchiseFee(userId, franchise_name, fee);
    res.status(201).json(franchiseFee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "가맹점 수수료 생성 중 오류가 발생했습니다." });
  }
};

const fetchFranchiseFees = async (req, res) => {
  const { id: userId } = req;

  try {
    const franchiseFees = await getFranchiseFees(userId);
    res.status(200).json(franchiseFees);
  } catch (error) {
    res
      .status(500)
      .json({ error: "가맹점 수수료 조회 중 오류가 발생했습니다." });
  }
};

// Delete Franchise Fee
const removeFranchiseFee = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteFranchiseFee(Number(id));
    res.status(200).json({ message: "가맹점 수수료가 삭제되었습니다." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "가맹점 수수료 삭제 중 오류가 발생했습니다." });
  }
};

// 회원정보 - 개인정보 조회
const fetchUserProfile = async (req, res) => {
  const { userId } = req;
  try {
    const userProfile = await getUserProfile(Number(userId));
    console.log(1);

    if (userProfile) {
      res.status(200).json(userProfile);
      console.log("성공", userProfile);
    } else {
      res.status(404).json({ error: "회원 정보를 찾을 수 없습니다." });
      console.log();
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "회원 정보를 조회하는 중 오류가 발생했습니다." });
  }
};

// 회원정보 - 차량정보 및 수수료 조회
const fetchUserVehiclesWithFees = async (req, res) => {
  const { userId } = req;

  try {
    const userVehicles = await getUserVehiclesWithFees(Number(userId));
    res.status(200).json(userVehicles);
  } catch (error) {
    res
      .status(500)
      .json({ error: "회원 차량 정보를 조회하는 중 오류가 발생했습니다." });
  }
};

// 회원정보 - 소득정보 조회
const fetchUserIncomeRecords = async (req, res) => {
  const { userId } = req;

  try {
    const incomeRecords = await getUserIncomeRecords(Number(userId));
    res.status(200).json(incomeRecords);
  } catch (error) {
    res
      .status(500)
      .json({ error: "회원 수입 정보를 조회하는 중 오류가 발생했습니다." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  kakaoLogin,
  naverLogin,
  updateUserProfile,
  updateUserVehicleHandler,
  updateUserIncome,
  addFranchiseFee,
  fetchFranchiseFees,
  removeFranchiseFee,
  fetchUserProfile,
  fetchUserVehiclesWithFees,
  fetchUserIncomeRecords,
};
