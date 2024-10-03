const axios = require("axios");
const jwt = require("jsonwebtoken");
const {
  findUserByKakaoId,
  findUserByGoogleId,
  findUserByNaverId,
  createUser,
  createUserProfile,
  createUserVehicle,
  createUserIncome,
  createMyCar,
  createDefaultMaintenanceItems,
  findUserByEmail,
} = require("../models/socialModel");

const socialLogin = async (req, res, provider) => {
  const { token } = req.body;

  console.log("Received token:", token);
  console.log("Provider:", provider);

  if (!token) {
    return res.status(400).json({ error: "토큰이 필요합니다." });
  }

  try {
    let userData;

    if (provider === "kakao") {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Kakao login response data:", response.data);

      userData = {
        id: String(response.data.id),
        email: response.data.kakao_account.email,
        nickname: "카카오 사용자",
      };

      console.log("Parsed user data:", userData);
    } else if (provider === "google") {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
      );

      console.log("Google login response data:", response.data);

      userData = {
        id: response.data.sub,
        email: response.data.email,
        nickname: "구글 사용자",
      };

      console.log("Parsed user data:", userData);
    } else if (provider === "naver") {
      const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Naver login response data:", response.data);

      userData = {
        id: response.data.response.id,
        email: response.data.response.email,
        nickname: response.data.response.nickname || "네이버 사용자",
      };
    } else {
      return res
        .status(400)
        .json({ error: "지원하지 않는 소셜 로그인 제공자입니다." });
    }

    const { id, email, nickname } = userData;

    console.log(`Looking for existing user by ${provider} ID:`, id);

    let user;

    if (provider === "kakao") {
      user = await findUserByKakaoId(id);
    } else if (provider === "google") {
      user = await findUserByGoogleId(id);
    } else if (provider === "naver") {
      user = await findUserByNaverId(id);
    }

    if (!user) {
      try {
        console.log("네이버 데이터", email, id, nickname);
        const existingEmailUser = await findUserByEmail(email);
        if (existingEmailUser) {
          return res.status(409).json({ error: "중복된 이메일 입니다." });
        }
        user = await createUser({
          nickname,
          username: email,
          password: null, // 소셜 로그인은 비밀번호가 없음
          userQuestion: null,
          userAnswer: null,
          jobtype: null,
          kakaoId: provider === "kakao" ? id : null,
          googleId: provider === "google" ? id : null,
          naverId: provider === "naver" ? id : null,
        });

        console.log("User created with ID:", user.id);

        // 사용자 프로필 생성
        await createUserProfile({
          userId: user.id,
          email: email,
          name: nickname,
        });

        console.log("User profile created for user ID:", user.id);

        // 사용자 차량 정보 생성
        await createUserVehicle({
          userId: user.id,
          carType: "",
          franchise_status: "",
          vehicle_name: "",
          year: null,
          fuel_type: "",
          mileage: null,
          commission_rate: null,
        });

        console.log("User vehicle info created for user ID:", user.id);

        // 사용자 소득 정보 생성
        await createUserIncome({
          userId: user.id,
          income_type: "",
          start_date: null,
          region1: "",
          region2: "",
          monthly_payment: null,
          fuel_allowance: null,
          investment: null,
          standard_expense_rate: null,
        });

        console.log("User income info created for user ID:", user.id);

        // my_car 테이블에 데이터 생성
        const myCar = await createMyCar({
          userId: user.id,
          vehicle_name: "",
          fuel_type: "",
          year: null,
          mileage: null,
          license_plate: "",
          first_registration_date: null,
          insurance_company: "",
          insurance_period: null,
          insurance_fee: null,
          insurance_period_start: null,
          insurance_period_end: null,
          imageUrl: "",
        });

        console.log("MyCar entry created for user ID:", user.id);

        // maintenance_items 테이블에 기본 항목 생성
        await createDefaultMaintenanceItems(myCar.id, user.id);

        console.log("Default maintenance items created for car ID:", myCar.id);
      } catch (error) {
        console.error("Error during user creation process:", error);
        return res.status(500).json({
          error: "회원가입 중 오류가 발생했습니다.",
          message: error.message,
          stack: error.stack,
        });
      }
    } else {
      console.log("Existing user found with ID:", user.id);
    }

    // JWT 발급
    const jwtToken = jwt.sign(
      { userId: user.id, jobtype: user.jobtype, permission: user.permission },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    console.log("JWT token generated for user ID:", user.id);
    res.status(200).json({
      token: jwtToken,
      nickname: user.nickname,
      message: "회원가입에 성공했습니다.",
    });
  } catch (error) {
    console.error("Error during social login:", error);

    // 에러 메시지와 스택을 클라이언트에 전송
    res.status(500).json({
      error: "로그인 중 오류가 발생했습니다.",
      message: error.message,
      stack: error.stack,
    });
  }
};

const kakaoLogin = (req, res) => socialLogin(req, res, "kakao");
const googleLogin = (req, res) => socialLogin(req, res, "google");
const naverLogin = (req, res) => socialLogin(req, res, "naver");

module.exports = {
  kakaoLogin,
  googleLogin,
  naverLogin,
};
