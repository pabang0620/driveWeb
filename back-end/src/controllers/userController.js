const {
  createUser,
  findUserByUsername,
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
  updateUserPassword,
  updateUserJobType,
  findUserById,
  findUserByNicknameAndSecurity,
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  const {
    email,
    nickname,
    password,
    securityQuestion,
    securityAnswer,
    jobtype,
  } = req.body;
  if (
    !email ||
    !nickname ||
    !password ||
    !securityQuestion ||
    !securityAnswer ||
    !jobtype
  ) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(
      nickname,
      email,
      hashedPassword,
      securityQuestion,
      securityAnswer,
      jobtype
    );

    const token = jwt.sign(
      { userId: user.id, jobtype: user.jobtype, permission: user.permission },
      process.env.JWT_SECRET,
      { expiresIn: "12h" } // 토큰 만료 시간 설정
    );
    res.status(201).json({ token, nickname: user.nickname });
  } catch (error) {
    res.status(500).json({ error: "사용자 생성 중 오류가 발생했습니다." });
  }
};
// 비밀번호찾기
async function verifySecurityAnswer(req, res) {
  const { username, securityQuestion, securityAnswer } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(
      user.userQuestion,
      securityQuestion,
      user.userAnswer,
      securityAnswer
    );
    if (
      user.userQuestion === securityQuestion &&
      user.userAnswer === securityAnswer
    ) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
// 아이디 찾기
const findUsername = async (req, res) => {
  const { nickname, securityQuestion, securityAnswer } = req.body;

  try {
    // 모델에서 사용자 정보를 찾습니다.
    const user = await findUserByNicknameAndSecurity(
      nickname,
      securityQuestion,
      securityAnswer
    );

    // 사용자가 존재할 경우
    if (user) {
      return res.status(200).json({
        success: true,
        username: user.username,
      });
    } else {
      // 사용자가 없을 경우
      return res.status(404).json({
        success: false,
        message: "일치하는 사용자를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("아이디 찾기 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
};

async function resetPassword(req, res) {
  const { username, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(username, hashedPassword);

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
  }
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res
        .status(401)
        .json({ error: "잘못된 이메일 또는 비밀번호입니다." });
    }

    // 유저 상태가 Inactive인 경우
    if (user.status === "Inactive") {
      return res.status(403).json({ error: "계정이 비활성화 되었습니다." });
    }

    // 비밀번호 비교
    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const token = jwt.sign(
      { userId: user.id, jobtype: user.jobtype, permission: user.permission }, // jobtype을 토큰의 페이로드에 추가
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({ token, nickname: user.nickname });
  } catch (error) {
    res.status(500).json({ error: "일반 로그인 중 오류가 발생했습니다." });
  }
};

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
    // console.log(1);

    if (userProfile) {
      res.status(200).json(userProfile);
      // console.log("성공", userProfile);
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
async function updateJobType(req, res) {
  const { userId } = req; // 인증 미들웨어에서 설정된 사용자 ID
  const { jobType } = req.body;
  const jobtype = Number(jobType);
  try {
    const updatedUser = await updateUserJobType(userId, jobtype);
    // 사용자의 최신 정보를 가져옵니다.
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const token = jwt.sign(
      { userId: user.id, jobType: user.jobType, permission: user.permission }, // jobType을 토큰의 페이로드에 추가
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({ success: true, updatedJobType: updatedUser.jobType, token });
  } catch (error) {
    console.error("Failed to update job type:", error);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = {
  registerUser,
  resetPassword,
  verifySecurityAnswer,
  findUsername,
  loginUser,
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
  updateJobType,
};
