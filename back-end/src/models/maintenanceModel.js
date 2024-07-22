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

// const getMaintenanceItems = async (userId) => {
//   try {
//     const items = await prisma.maintenance_items.findMany({
//       where: { userId },
//     });
//     return items;
//   } catch (error) {
//     console.error("정비 항목 조회 중 오류:", error);
//     throw error; // 오류를 다시 던져 호출한 쪽에서도 처리할 수 있게 합니다.
//   }
// };
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

// 정비 기록 가져오기
// const getMaintenanceRecords = async (userId) => {
//   try {
//     const records = await prisma.maintenance_records.findMany({
//       where: { userId },
//       include: {
//         maintenance_items: true, // 관련된 정비 항목도 포함
//         my_car: true, // 관련된 차량도 포함
//       },
//     });
//     return records;
//   } catch (error) {
//     console.error("정비 기록 가져오는 중 오류:", error);
//     throw error; // 오류를 다시 던져 호출한 쪽에서도 처리할 수 있게 합니다.
//   }
// };

const createMaintenanceRecord = async (data) => {
  try {
    console.log("데이터:", data);
    const result = await prisma.maintenance_records.create({
      data: {
        maintenanceItemId: data.maintenanceItemId,
        maintenanceDate: data.maintenanceDate
          ? new Date(data.maintenanceDate).toISOString()
          : null,
        maintenanceInterval: data.maintenanceInterval,
        maintenanceDistance: data.maintenanceDistance,
        maintenanceMethod: data.maintenanceMethod,
        mileageAtMaintenance: data.mileageAtMaintenance,
        maintenanceCost: data.maintenanceCost,
        carId: data.carId,
        userId: data.userId,
      },
    });
    console.log("생성된 기록:", result);
    return result;
  } catch (error) {
    console.error("정비 기록 생성 중 오류:", error);
    throw error; // 오류를 다시 던져 호출한 쪽에서도 처리할 수 있게 합니다.
  }
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
const updateMaintenanceRecords = async (records) => {
  for (const record of records) {
    const {
      id,
      maintenanceItemId,
      maintenanceDate,
      maintenanceMileage,
      currentMileage,
      cost,
      maintenanceMethod,
      carId,
    } = record;
    await prisma.maintenance_records.update({
      where: { id: Number(id) },
      data: {
        maintenanceItemId,
        maintenanceDate,
        maintenanceMileage,
        currentMileage,
        cost,
        maintenanceMethod,
        carId,
      },
    });
  }
};
// models/maintenanceModel.js

const getMaintenanceRecordsWithItemsByUserId = async (
  userId,
  page = 1,
  pageSize = 10
) => {
  try {
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
        maintenanceDate: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return records;
  } catch (error) {
    console.error("정비 기록과 항목 가져오는 중 오류:", error);
    throw error;
  }
};

module.exports = {
  getMaintenanceItemsWithRecords,
  createMaintenanceItem,
  createMaintenanceRecord,
  updateMaintenanceItems,
  updateMaintenanceRecords,
  getMaintenanceRecordsWithItemsByUserId,
};
