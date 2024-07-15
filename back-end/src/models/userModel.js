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
          carType: "", // 차량구분 초기화
          franchise_status: "", // 가맹여부 초기화
          commission_rate: null, // 카드수수료 초기화
          vehicle_name: "", // 차량명 초기화
          year: null, // 연식 초기화
          fuel_type: "", // 연료 타입 초기화
          mileage: null, // 누적 주행거리 초기화
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
  try {
    const userProfile = await prisma.user_profiles.create({
      data: {
        userId,
        ...profileData,
      },
    });
    return userProfile; // 프로필 생성 성공 시 반환
  } catch (error) {
    console.error("프로필 생성 중 오류 발생:", error); // 오류 로깅
    throw error; // 오류를 다시 던져 호출한 곳에서 처리할 수 있도록 함
  }
};
// 자동차등록 관련
const addUserVehicle = async (userId, vehicleData) => {
  const vehicle = await prisma.user_vehicles.create({
    data: {
      userId,
      ...vehicleData,
    },
  });

  // my_car 테이블에 동일한 데이터를 저장
  await prisma.my_car.create({
    data: {
      userId,
      vehicle_name: vehicleData.vehicle_name,
      fuel_type: vehicleData.fuel_type,
      year: vehicleData.year,
      mileage: vehicleData.mileage,
    },
  });

  return vehicle;
};

// 지출정보등록 관련
const createUserIncome = async (userId, incomeData) => {
  try {
    // 데이터베이스에 지출 정보 등록
    const newIncome = await prisma.user_incomes.create({
      data: {
        userId,
        ...incomeData,
      },
    });

    console.log("지출 정보 등록 성공:", newIncome);
    return newIncome;
  } catch (error) {
    console.error("지출 정보 등록 중 오류 발생:", error);
    throw new Error("지출 정보 등록에 실패했습니다.");
  }
};

// 수수료 입력 및 삭제 수정
const createFranchiseFee = async (userId, franchise_name, fee) => {
  return await prisma.franchise_fees.create({
    data: {
      userId,
      franchise_name,
      fee,
    },
  });
};

// 수수료 조회
const getFranchiseFees = async (userId) => {
  return await prisma.franchise_fees.findMany({
    where: {
      userId,
    },
  });
};
// 수수료율 삭제
const deleteFranchiseFee = async (id) => {
  return await prisma.franchiseFee.delete({
    where: { id },
  });
};
// 회원정보 - 개인 정보 조회
const getUserProfile = async (userId) => {
  console.log("모델에서 유저아이디", userId);
  try {
    const latestUserProfile = await prisma.user_profiles.findMany({
      where: { userId: userId },
      orderBy: { id: "desc" }, // 'desc'는 내림차순으로 정렬함을 의미합니다.
    });

    if (!latestUserProfile) {
      console.log("해당 사용자에 대한 소득 정보가 없습니다.");
      return null; // 소득 정보가 없는 경우 null 반환
    }

    return latestUserProfile[0];
  } catch (error) {
    console.error("최신 프로필 정보 조회 중 오류가 발생했습니다.", error);
    throw new Error("프로필 정보 조회 중 오류가 발생했습니다.");
  }
};

// 회원정보 - 차량 및 수수료 조회
const getUserVehiclesWithFees = async (userId) => {
  try {
    const latestVehicleWithFees = await prisma.user_vehicles.findFirst({
      where: { userId: userId },
      orderBy: { id: "desc" },
      include: {
        franchise_fees: true, // 관련 수수료 정보도 함께 가져옴
      },
    });

    if (!latestVehicleWithFees) {
      console.log("해당 사용자에 대한 소득 정보가 없습니다.");
      return null; // 소득 정보가 없는 경우 null 반환
    }

    return latestVehicleWithFees; // 가장 최신의 차량 정보와 관련 수수료 정보를 반환
  } catch (error) {
    console.error("최신 차량 정보 조회 중 오류가 발생했습니다.", error);
    throw new Error("차량 정보 조회 중 오류가 발생했습니다.");
  }
};

// 회원정보 - 소득정보 조회
const getUserIncomeRecords = async (userId) => {
  try {
    const latestIncomeRecord = await prisma.user_incomes.findFirst({
      where: { userId: userId },
      orderBy: { id: "desc" }, // 내림차순으로 정렬
    });

    if (!latestIncomeRecord || latestIncomeRecord.length === 0) {
      console.log("해당 사용자에 대한 소득 정보가 없습니다.");
      return null; // 소득 정보가 없는 경우 null 반환
    }

    return latestIncomeRecord; // 배열로 반환
  } catch (error) {
    console.error("소득 정보 조회 중 오류가 발생했습니다.", error);
    throw new Error("소득 정보 조회 중 오류가 발생했습니다.");
  }
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
  createUserProfile,
  addUserVehicle,
  createUserIncome,
  createFranchiseFee,
  getFranchiseFees,
  deleteFranchiseFee,
  getUserProfile,
  getUserVehiclesWithFees,
  getUserIncomeRecords,
};
