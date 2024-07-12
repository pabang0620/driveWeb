const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (
  nickname,
  username,
  password,
  jobtype,
  googleId = null,
  kakaoId = null,
  naverId = null
) => {
  const user = await prisma.users.create({
    data: {
      nickname,
      username,
      password, // 비밀번호는 해시처리된 상태로 저장
      jobtype,
      googleId,
      kakaoId,
      naverId,
      user_profiles: {
        create: {
          name: "", // 이름 초기화
          birth_date: null, // 생년월일 초기화
          phone: "", // 전화번호 초기화
          email: "", // 이메일 초기화
        },
      },
      user_vehicles: {
        create: {
          taxi_type: "", // 택시 유형 초기화
          franchise_status: "", // 프랜차이즈 상태 초기화
          vehicle_name: "", // 차량명 초기화
          year: null, // 연식 초기화
          fuel_type: "", // 연료 타입 초기화
          mileage: null, // 주행 거리 초기화
          commission_rate: null, // 수수료율 초기화
        },
      },
      user_incomes: {
        create: {
          income_type: "", // 소득 유형 초기화
          start_date: null, // 시작일 초기화
          region1: "", // 지역1 초기화
          region2: "", // 지역2 초기화
          monthly_payment: null, // 월급여 초기화
          fuel_allowance: null, // 연료 보조금 초기화
          investment: null, // 투자 초기화
          standard_expense_rate: null, // 표준 경비율 초기화
        },
      },
    },
    include: {
      user_profiles: true,
      user_vehicles: true,
      user_incomes: true,
    },
  });

  return user;
};

const findUserByUsername = async (username) => {
  return await prisma.users.findUnique({
    where: { username },
  });
};

const findUserByGoogleId = async (googleId) => {
  return await prisma.users.findUnique({
    where: { googleId },
  });
};

const findUserByKakaoId = async (kakaoId) => {
  return await prisma.users.findUnique({
    where: { kakaoId },
  });
};

const findUserByNaverId = async (naverId) => {
  return await prisma.users.findUnique({
    where: { naverId },
  });
};

// 회원정보등록 관련
const createUserProfile = async (userId, profileData) => {
  return await prisma.user_profiles.create({
    data: {
      userId,
      ...profileData,
    },
  });
};
const createUserVehicle = async (userId, vehicleData) => {
  const vehicle = await prisma.user_vehicles.create({
    data: {
      userId,
      ...vehicleData,
    },
  });

  const myCarData = {
    userId,
    vehicle_name: vehicle.vehicle_name,
    fuel_type: vehicle.fuel_type,
    year: vehicle.year,
    mileage: vehicle.mileage,
    license_plate: vehicleData.license_plate,
    first_registration_date: vehicleData.first_registration_date,
    insurance_company: vehicleData.insurance_company,
    insurance_period: vehicleData.insurance_period,
    insurance_fee: vehicleData.insurance_fee,
  };

  await prisma.my_car.create({
    data: myCarData,
  });

  return vehicle;
};
const createUserIncome = async (userId, incomeData) => {
  return await prisma.user_incomes.create({
    data: {
      userId,
      ...incomeData,
    },
  });
};
// 수수료 입력 및 삭제 수정
const createFranchiseFee = async (userId, franchiseName, fee) => {
  return await prisma.franchiseFee.create({
    data: {
      userId,
      franchiseName,
      fee,
    },
  });
};

// Update Franchise Fee
const updateFranchiseFee = async (id, data) => {
  return await prisma.franchiseFee.update({
    where: { id },
    data,
  });
};

// Delete Franchise Fee
const deleteFranchiseFee = async (id) => {
  return await prisma.franchiseFee.delete({
    where: { id },
  });
};
// 회원정보 - 개인 정보 조회
const getUserProfile = async (userId) => {
  console.log("모델에서 유저아이디", userId);
  try {
    const userProfile = await prisma.user_profiles.findUnique({
      where: {
        userId: Number(userId), // userId를 정수형으로 변환하여 전달
      },
    });
    console.log("사용자 프로필:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("getUserProfile 오류:", error);
    throw error;
  }
};

// 회원정보 - 차량 및 수수료 조회
const getUserVehiclesWithFees = async (userId) => {
  const userVehicles = await prisma.user_vehicles.findMany({
    where: { userId },
    include: {
      franchise_fees: true,
    },
  });
  return userVehicles;
};

// 회원정보 - 소득정보 조회
const getUserIncomeRecords = async (userId) => {
  return await prisma.income_records.findMany({
    where: { userId },
  });
};
module.exports = {
  createUser,
  findUserByUsername,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
  createUserProfile,
  createUserVehicle,
  createUserIncome,
  createFranchiseFee,
  updateFranchiseFee,
  deleteFranchiseFee,
  getUserProfile,
  getUserVehiclesWithFees,
  getUserIncomeRecords,
};
