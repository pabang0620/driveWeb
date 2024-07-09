const {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
  deleteFranchiseFee,
  updateFranchiseFee,
  createFranchiseFee,
  getUserProfile,
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const registerUser = async (req, res) => {
  const { nickname, username, password, jobType } = req.body;

  if (!nickname || !username || !password || !jobType) {
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
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
        email: response.data.email,
      };
    } else if (provider === "kakao") {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      userData = {
        id: response.data.id,
        name: response.data.properties.nickname,
        email: response.data.kakao_account.email,
      };
    } else if (provider === "naver") {
      const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      userData = {
        id: response.data.response.id,
        name: response.data.response.name,
        email: response.data.response.email,
      };
    }

    const { id, name, email } = userData;
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
        email,
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

const addUserProfile = async (req, res) => {
  const { userId } = req.userId;
  const profileData = req.body;

  try {
    const profile = await createUserProfile(userId, profileData);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: "프로필 생성 중 오류가 발생했습니다." });
  }
};

const addUserVehicle = async (req, res) => {
  const { userId } = req.userId;
  const vehicleData = req.body;

  try {
    const vehicle = await createUserVehicle(userId, vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "차량 정보 생성 중 오류가 발생했습니다." });
  }
};

const addUserIncome = async (req, res) => {
  const { userId } = req.userId;
  const incomeData = req.body;

  try {
    const income = await createUserIncome(userId, incomeData);
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: "소득 정보 생성 중 오류가 발생했습니다." });
  }
};

// 수수료 등록 수정 삭제 컨트롤러
const addFranchiseFee = async (req, res) => {
  const { userId } = req.userId;
  const { franchiseName, fee } = req.body;

  try {
    const franchiseFee = await createFranchiseFee(userId, franchiseName, fee);
    res.status(201).json(franchiseFee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "가맹점 수수료 생성 중 오류가 발생했습니다." });
  }
};

// Update Franchise Fee
const editFranchiseFee = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const franchiseFee = await updateFranchiseFee(Number(id), data);
    res.status(200).json(franchiseFee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "가맹점 수수료 수정 중 오류가 발생했습니다." });
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
  const { userId } = req.userId;

  try {
    const userProfile = await getUserProfile(Number(userId));
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ error: "회원 정보를 찾을 수 없습니다." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "회원 정보를 조회하는 중 오류가 발생했습니다." });
  }
};

// 회원정보 - 차량정보 및 수수료 조회
const fetchUserVehiclesWithFees = async (req, res) => {
  const userId = req.userId;

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
  const userId = req.userId;

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
  addUserProfile,
  addUserVehicle,
  addUserIncome,
  addFranchiseFee,
  editFranchiseFee,
  removeFranchiseFee,
  fetchUserProfile,
  fetchUserVehiclesWithFees,
  fetchUserIncomeRecords,
};
