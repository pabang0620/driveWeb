const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (
  nickname,
  email,
  password,
  jobType,
  googleId = null,
  kakaoId = null,
  naverId = null
) => {
  return await prisma.users.create({
    data: {
      nickname,
      email,
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

module.exports = {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
  createUserProfile,
  createUserVehicle,
  createUserIncome,
};
