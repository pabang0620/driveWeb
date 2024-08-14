const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// 정비항목 가져오기
const getMaintenanceItemsWithRecords = async (userId) => {
  try {
    const items = await prisma.maintenance_items.findMany({
      where: { userId },
      include: {
        maintenance_records: {
          where: { userId },
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
    });
    return items;
  } catch (error) {
    console.error("정비 항목 및 기록 가져오는 중 오류:", error);
    throw error; // 오류를 다시 던져 호출한 쪽에서도 처리할 수 있게 합니다.
  }
};

// 정비항목 생성하기
const createMaintenanceItem = async (data) => {
  try {
    console.log("데이터:", data);
    const result = await prisma.maintenance_items.create({
      data,
    });
    console.log("생성된 항목:", result);
    return result;
  } catch (error) {
    console.error("정비 항목 생성 중 오류:", error);
    throw error; // 오류를 다시 던져 호출한 쪽에서도 처리할 수 있게 합니다.
  }
};

const createMaintenanceRecord = async (data) => {
  try {
    const fullDateTime = new Date(data.maintenanceDate).toISOString();

    const result = await prisma.maintenance_records.create({
      data: {
        ...data,
        maintenanceDate: fullDateTime, // 변환된 날짜-시간 문자열 사용
      },
    });
    return result;
  } catch (error) {
    console.error("정비 기록 생성 중 오류:", error);
    throw error;
  }
};

const getLastMaintenanceRecord = async (carId, userId) => {
  return await prisma.maintenance_records.findFirst({
    where: {
      carId: carId,
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
const updateMaintenanceItems = async (items) => {
  for (const item of items) {
    const { id, name, unit, my_carId } = item;
    await prisma.maintenance_items.update({
      where: { id: Number(id) },
      data: { name, unit, my_carId },
    });
  }
};

// 세부데이터업데이트
const updateMaintenanceRecord = async (id, data) => {
  return prisma.maintenance_records.update({
    where: { id: parseInt(id) },
    data: {
      maintenanceDate: new Date(data.maintenanceDate),
      maintenanceDistance: parseInt(data.maintenanceDistance),
      maintenanceMethod: data.maintenanceMethod,
      mileageAtMaintenance: parseInt(data.mileageAtMaintenance),
      maintenanceCost: parseFloat(data.maintenanceCost),
    },
  });
};

const findMaintenanceRecordById = async (id) => {
  return prisma.maintenance_records.findUnique({
    where: { id: parseInt(id) },
  });
};
// models/maintenanceModel.js

const getMaintenanceRecordsWithItemsByUserId = async (
  userId,
  page = 1,
  pageSize = 10
) => {
  try {
    const totalCount = await prisma.maintenance_records.count({
      where: { userId },
    });

    const records = await prisma.maintenance_records.findMany({
      where: { userId },
      include: {
        maintenance_items: {
          select: {
            name: true,
          },
        },
        my_car: true,
      },
      orderBy: {
        createdAt: "desc", // createdAt 기준으로 최신순 정렬
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { records, totalCount };
  } catch (error) {
    console.error("정비 기록과 항목 가져오는 중 오류:", error);
    throw error;
  }
};

module.exports = {
  getMaintenanceItemsWithRecords,
  createMaintenanceItem,
  createMaintenanceRecord,
  getLastMaintenanceRecord,
  updateMaintenanceItems,
  updateMaintenanceRecord,
  findMaintenanceRecordById,
  getMaintenanceRecordsWithItemsByUserId,
};
