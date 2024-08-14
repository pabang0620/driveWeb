<<<<<<< HEAD
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
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const registerUser = async (req, res) => {
  const { nickname, username, password, jobType } = req.body;
  if (!nickname || !username || !password || !jobType) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }
  // const { nickname, username, password } = req.body;

  if (!nickname || !username || !password || !jobType) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }
  // console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(nickname, username, hashedPassword, jobType);
    // const user = await createUser(nickname, username, hashedPassword);

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

    console.log("username", username);
    console.log("user", user);

    const token = jwt.sign(
      { userId: user.id, jobType: user.jobType }, // jobType을 토큰의 페이로드에 추가
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    console.log(token);
    res.status(200).json({ token });
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
=======
const {
  createUser,
  findUserByUsername,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
  deleteFranchiseFee,
  createFranchiseFee,
  getUserProfile,
  getUserIncomeRecords,
  getUserVehiclesWithFees,
  updateUserProfileData,
  updateUserIncomeData,
  updateUserVehicle,
  getFranchiseFeesByUserId,
  updateFranchiseFee,
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
    const user = await createUser(nickname, username, hashedPassword, jobtype);
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
  const { name, birth_date, phone, username } = req.body;
  let imageUrl = req.file ? req.file.location : req.body.imageUrl || null;

  const profileData = {
    name,
    birth_date,
    phone,
    username,
    imageUrl, // 이미지 URL을 항상 포함
  };

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
  const { userId } = req;
  const { franchise_info } = req.body;

  try {
    if (!Array.isArray(franchise_info)) {
      return res.status(400).json({ error: "Invalid franchise_info format" });
    }

    const processedFranchiseFees = [];
    for (const info of franchise_info) {
      const { id, franchise_name, fee } = info;

      let franchiseFee;
      if (id) {
        franchiseFee = await updateFranchiseFee(id, franchise_name, fee);
      } else {
        franchiseFee = await createFranchiseFee(userId, franchise_name, fee);
      }

      processedFranchiseFees.push(franchiseFee);
    }

    res.status(201).json(processedFranchiseFees);
  } catch (error) {
    console.error("Error processing franchise fees:", error);
    res
      .status(500)
      .json({ error: "가맹점 수수료 처리 중 오류가 발생했습니다." });
  }
};
// 수수료 get
const getFranchiseFees = async (req, res) => {
  const { userId } = req;

  try {
    const franchiseFees = await getFranchiseFeesByUserId(userId);

    res.status(200).json(franchiseFees);
  } catch (error) {
    console.error("Error fetching franchise fees:", error);
    res
      .status(500)
      .json({ error: "가맹점 수수료 조회 중 오류가 발생했습니다." });
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
  getFranchiseFees,
  removeFranchiseFee,
  fetchUserProfile,
  fetchUserVehiclesWithFees,
  fetchUserIncomeRecords,
};
>>>>>>> 00f469d31a0ff91294adfd9fa0e9af19d0f5108f
