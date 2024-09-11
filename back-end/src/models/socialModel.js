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
  {
    name: "에어클리너 필터",
    maintenanceInterval: 3,
    maintenanceDistance: null, // 주행거리가 없음
  },
  {
    name: "공조 장치용 에어필터",
    maintenanceInterval: 3,
    maintenanceDistance: null,
  },
  {
    name: "타이어 위치 교체",
    maintenanceInterval: 6,
    maintenanceDistance: 50000,
  },
  {
    name: "브레이크/클러치(사양 적용시)액",
    maintenanceInterval: 6,
    maintenanceDistance: 80000,
  },
  {
    name: "엔진 오일 및 오일필터",
    maintenanceInterval: 6,
    maintenanceDistance: 8000,
  },
  {
    name: "점화 플러그",
    maintenanceInterval: 6,
    maintenanceDistance: 140000,
  },
  {
    name: "냉각수량 점검 및 교체",
    maintenanceInterval: 12,
    maintenanceDistance: null,
  },
];

// 기본 정비 항목 및 레코드 생성
const createDefaultMaintenanceItems = async (carId, userId) => {
  try {
    // 1. maintenance_items 테이블에 항목 생성
    const createdItems = await Promise.all(
      defaultMaintenanceItems.map(async (item) => {
        const newItem = await prisma.maintenance_items.create({
          data: {
            name: item.name,
            my_carId: carId,
            userId: userId,
          },
        });
        return { ...newItem, ...item }; // 새로 생성된 항목과 기본 설정값 병합
      })
    );

    // 2. 생성된 maintenance_items의 id 값을 사용하여 maintenance_records 생성
    await Promise.all(
      createdItems.map(async (item) => {
        await prisma.maintenance_records.create({
          data: {
            maintenanceItemId: item.id, // 생성된 maintenance_items의 id 전달
            userId: userId,
            carId: carId,
            maintenanceInterval: item.maintenanceInterval, // 기본 설정값
            maintenanceDistance: item.maintenanceDistance || null, // 없으면 null
          },
        });
      })
    );

    console.log("Default maintenance items and records created successfully.");
  } catch (error) {
    console.error(
      "Error creating default maintenance items and records:",
      error
    );
    throw new Error("Error creating default maintenance items and records");
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
