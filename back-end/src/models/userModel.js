const { PrismaClient } = require("@prisma/client");
const { createDefaultMaintenanceItems } = require("./mycarModel");
const prisma = new PrismaClient();

const createUser = async (
  nickname,
  email,
  password,
  securityQuestion,
  securityAnswer,
  jobtype,
  googleId = null,
  kakaoId = null,
  naverId = null
) => {
  try {
    const user = await prisma.users.create({
      data: {
        nickname,
        username: email,
        password, // 비밀번호는 해시처리된 상태로 저장
        jobtype,
        googleId,
        kakaoId,
        naverId,
        userQuestion: securityQuestion,
        userAnswer: securityAnswer,
        user_profiles: {
          create: {
            name: "", // 이름 초기화
            birth_date: null, // 생년월일 초기화
            phone: "", // 전화번호 초기화
            email: email, // 이메일 초기화
          },
        },
        user_vehicles: {
          create: {
            carType: "", // 차량 구분 초기화
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
            start_date: null, // 시작 날짜 초기화
            region1: "", // 지역 초기화
            region2: "", // 지역 초기화
            monthly_payment: null, // 월 지급액 초기화
            fuel_allowance: null, // 연료 수당 초기화
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

    const myCar = await prisma.my_car.create({
      data: {
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
      },
    });

    await createDefaultMaintenanceItems(myCar.id, user.id);

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
};

const findUserByUsername = async (username) => {
  return await prisma.users.findUnique({
    where: { username },
    select: {
      id: true,
      password: true,
      status: true,
      jobtype: true,
      permission: true,
      nickname: true, // 닉네임도 조회하도록 추가
    },
  });
};

async function updateUserPassword(username, hashedPassword) {
  return prisma.users.update({
    where: {
      username: username,
    },
    data: {
      password: hashedPassword,
    },
  });
}

const updateUserProfileData = async (userId, profileData) => {
  try {
    const userProfile = await prisma.user_profiles.update({
      where: { userId: userId },
      data: profileData,
    });
    return userProfile;
  } catch (error) {
    console.error("프로필 업데이트 중 오류 발생:", error);
    throw error;
  }
};

// 자동차등록 관련
const updateUserVehicle = async (userId, vehicleData) => {
  try {
    const existingVehicle = await prisma.user_vehicles.findUnique({
      where: { userId },
    });

    if (!existingVehicle) {
      throw new Error("해당 사용자의 차량 정보를 찾을 수 없습니다.");
    }

    // mileage 값을 정수로 변환
    if (vehicleData.mileage) {
      vehicleData.mileage = parseInt(vehicleData.mileage, 10);
    }

    const updatedVehicle = await prisma.user_vehicles.update({
      where: { userId },
      data: vehicleData,
    });

    // my_car 테이블 업데이트
    await prisma.my_car.update({
      where: { userId },
      data: {
        vehicle_name: vehicleData.vehicle_name,
        fuel_type: vehicleData.fuel_type,
        year: vehicleData.year,
        mileage: vehicleData.mileage,
      },
    });

    return updatedVehicle;
  } catch (error) {
    console.error("차량 정보 업데이트 중 오류 발생:", error);
    throw new Error("차량 정보 업데이트에 실패했습니다.");
  }
};

// 지출정보등록 관련
const updateUserIncomeData = async (userId, incomeData) => {
  try {
    if (incomeData.start_date) {
      incomeData.start_date = new Date(incomeData.start_date);
    }

    const existingIncome = await prisma.user_incomes.findUnique({
      where: { userId },
    });

    if (!existingIncome) {
      throw new Error("해당 사용자의 소득 정보를 찾을 수 없습니다.");
    }

    const updatedIncome = await prisma.user_incomes.update({
      where: { userId },
      data: {
        ...incomeData,
      },
    });

    console.log("소득 정보 업데이트 성공:", updatedIncome);
    return updatedIncome;
  } catch (error) {
    console.error("소득 정보 업데이트 중 오류 발생:", error);
    throw new Error("소득 정보 업데이트에 실패했습니다.");
  }
};

// 수수료 입력 및 삭제 수정
const createFranchiseFee = async (userId, franchise_name, fee) => {
  console.log(userId, franchise_name, fee);

  return await prisma.franchise_fees.create({
    data: {
      userId,
      franchise_name,
      fee: parseFloat(fee), // fee가 문자열로 전달될 경우 숫자로 변환
    },
  });
};

const updateFranchiseFee = async (id, franchise_name, fee) => {
  return await prisma.franchise_fees.update({
    where: { id },
    data: {
      franchise_name,
      fee: parseFloat(fee), // fee가 문자열로 전달될 경우 숫자로 변환
    },
  });
};
// 수수료 조회
const getFranchiseFeesByUserId = async (userId) => {
  return await prisma.franchise_fees.findMany({
    where: { userId },
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

async function updateUserJobType(userId, jobtype) {
  try {
    console.log(userId, jobtype);
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { jobtype },
    });
    return updatedUser;
  } catch (error) {
    console.error("Failed to update job type:", error);
    throw error; // Error를 던져 컨트롤러에서 처리하도록 합니다.
  }
}
async function findUserById(userId) {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}
module.exports = {
  createUser,
  findUserByUsername,
  updateUserPassword,
  updateUserProfileData,
  updateUserVehicle,
  updateUserIncomeData,
  createFranchiseFee,
  updateFranchiseFee,
  getFranchiseFeesByUserId,
  deleteFranchiseFee,
  getUserProfile,
  getUserVehiclesWithFees,
  getUserIncomeRecords,
  updateUserJobType,
  findUserById,
};
