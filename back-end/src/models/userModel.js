const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (
  nickname,
  username,
  password,
  jobType,
  googleId = null,
  kakaoId = null,
  naverId = null
) => {
  return await prisma.users.create({
    data: {
      nickname,
      username,
      password, // 일반 로그인 용
      jobType, // jobType 추가
      googleId,
      kakaoId,
      naverId,
    },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
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
  return await prisma.user_profiles.findUnique({
    where: { userId },
  });
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
  findUserByEmail,
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
