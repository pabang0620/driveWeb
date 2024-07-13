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
const createUserVehicle = async (userId, vehicleData) => {
  // 새 차량 데이터 생성
  const vehicle = await prisma.user_vehicles.create({
    data: {
      userId,
      ...vehicleData,
    },
  });

  // 사용자의 가장 최신 차량 정보 가져오기
  const latestVehicle = await prisma.user_vehicles.findFirst({
    where: { userId },
    orderBy: { id: "desc" },
  });

  // 차량 관련 데이터 준비
  const myCarData = {
    userId,
    vehicle_name: latestVehicle.vehicle_name,
    fuel_type: latestVehicle.fuel_type,
    year: latestVehicle.year,
    mileage: latestVehicle.mileage,
    license_plate: vehicleData.license_plate,
    first_registration_date: vehicleData.first_registration_date,
    insurance_company: vehicleData.insurance_company,
    insurance_period: vehicleData.insurance_period,
    insurance_fee: vehicleData.insurance_fee,
  };

  // my_car 테이블에 데이터 생성
  await prisma.my_car.create({
    data: myCarData,
  });

  // 수수료 정보 가져오기
  const fees = await prisma.franchise_fees.findMany({
    where: { userId },
  });

  // 최신 차량 정보와 수수료 정보를 함께 반환
  return { vehicle: latestVehicle, fees };
};

// 지출정보등록 관련
const createUserIncome = async (userId, incomeData) => {
  try {
    // 입력 데이터 검증 (예시: 필수 필드 검사)
    if (!userId || !incomeData.income_type) {
      throw new Error("필수 정보가 누락되었습니다.");
    }

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
    const latestVehicleWithFees = await prisma.user_vehicles.findMany({
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
    const latestIncomeRecord = await prisma.income_records.findFirst({
      where: { userId: userId },
      orderBy: { id: "desc" }, // 'desc'는 내림차순으로 정렬함을 의미합니다.
    });

    if (!latestIncomeRecord) {
      console.log("해당 사용자에 대한 소득 정보가 없습니다.");
      return null; // 소득 정보가 없는 경우 null 반환
    }

    return latestIncomeRecord;
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
  createUserVehicle,
  createUserIncome,
  createFranchiseFee,
  updateFranchiseFee,
  deleteFranchiseFee,
  getUserProfile,
  getUserVehiclesWithFees,
  getUserIncomeRecords,
};
