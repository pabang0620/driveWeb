const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCarByUserId = async (userId) => {
  return await prisma.my_car.findUnique({
    where: { userId: userId },
  });
};

const updateCarByUserId = async (userId, updateData) => {
  return await prisma.my_car.update({
    where: { userId: userId },
    data: updateData,
  });
};

const updateUserVehicleByUserId = async (userId, updateData) => {
  return await prisma.user_vehicles.update({
    where: { userId: userId },
    data: updateData,
  });
};

const updateCarImageUrl = async (userId, imageUrl) => {
  return await prisma.my_car.update({
    where: { userId: userId },
    data: { imageUrl: imageUrl },
  });
};
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
    userId: userId, // userId 추가
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
  getCarByUserId,
  updateCarByUserId,
  updateUserVehicleByUserId,
  updateCarImageUrl,
  createDefaultMaintenanceItems,
};
