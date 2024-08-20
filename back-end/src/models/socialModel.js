const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 사용자 조회 함수 (Kakao ID로 조회)
async function findUserByKakaoId(kakaoId) {
  return await prisma.users.findUnique({
    where: { kakaoId },
  });
}

// 사용자 조회 함수 (Google ID로 조회)
async function findUserByGoogleId(googleId) {
  return await prisma.users.findUnique({
    where: { googleId },
  });
}

// 사용자 조회 함수 (Naver ID로 조회)
async function findUserByNaverId(naverId) {
  return await prisma.users.findUnique({
    where: { naverId },
  });
}

// 사용자 생성 함수
async function createUser(data) {
  return await prisma.users.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

// 사용자 프로필 생성 함수
async function createUserProfile(data) {
  return await prisma.user_profiles.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

// 사용자 차량 정보 생성 함수
async function createUserVehicle(data) {
  return await prisma.user_vehicles.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

// 사용자 소득 정보 생성 함수
async function createUserIncome(data) {
  return await prisma.user_incomes.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

// MyCar 데이터 생성 함수
async function createMyCar(data) {
  return await prisma.my_car.create({
    data: {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}
// 정비목록 회원가입 시 생성
const defaultMaintenanceItems = [
  "에어클리너 필터",
  "공조 장치용 에어필터",
  "타이어 위치 교체",
  "브레이크/클러치(사양 적용시)액",
  "엔진 오일 및 오일필터",
  "점화 플러그",
  "냉각수량 점검 및 교체",
];

const createDefaultMaintenanceItems = async (carId, userId) => {
  const maintenanceItems = defaultMaintenanceItems.map((item) => ({
    name: item,
    my_carId: carId,
    userId: userId,
  }));

  try {
    await prisma.maintenance_items.createMany({
      data: maintenanceItems,
    });
  } catch (error) {
    console.error("Error creating default maintenance items:", error);
    throw new Error("Error creating default maintenance items");
  }
};
module.exports = {
  findUserByKakaoId,
  findUserByGoogleId,
  findUserByNaverId,
  createUser,
  createUserProfile,
  createUserVehicle,
  createUserIncome,
  createMyCar,
  createDefaultMaintenanceItems,
};
