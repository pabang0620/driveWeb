const {
  createMaintenanceItem,
  createMaintenanceRecord,
  updateMaintenanceItem,
  updateMaintenanceRecord,
  getMaintenanceItemsWithRecords,
  getMaintenanceRecordsWithItemsByUserId,
} = require("../models/maintenanceModel");
// 정비 기록 가져오기
const getItemsWithRecords = async (req, res) => {
  const { userId } = req;
  try {
    const items = await getMaintenanceItemsWithRecords(userId);
    res.json(items);
  } catch (error) {
    console.error("Error fetching maintenance items with records:", error);
    res.status(500).json({ error: "정비 항목 조회 중 오류가 발생했습니다." });
  }
};
// 정비 항목 추가 및 정비 기록 자동 생성
const addItem = async (req, res) => {
  const { name, unit, my_carId } = req.body; // body에서 데이터 받아오기
  const { userId } = req; // req에서 userId 받아오기

  try {
    // 정비 항목 생성
    const item = await createMaintenanceItem({ name, unit, my_carId, userId });

    res.json({ item });
  } catch (error) {
    console.error("Error adding maintenance item:", error);
    res.status(500).json({ error: "정비 항목 추가 중 오류가 발생했습니다." });
  }
};
// 정비 기록 추가
const addMaintenanceRecord = async (req, res) => {
  const {
    maintenanceItemId,
    maintenanceDate,
    maintenanceInterval,
    maintenanceDistance,
    maintenanceMethod,
    mileageAtMaintenance,
    maintenanceCost,
    carId,
  } = req.body;
  const { userId } = req;

  try {
    const record = await createMaintenanceRecord({
      maintenanceItemId,
      maintenanceDate,
      maintenanceInterval,
      maintenanceDistance,
      maintenanceMethod,
      mileageAtMaintenance,
      maintenanceCost,
      carId,
      userId,
    });

    res.json({ record });
  } catch (error) {
    console.error("Error adding maintenance record:", error);
    res.status(500).json({ error: "정비 기록 추가 중 오류가 발생했습니다." });
  }
};
// -----------------------------------------
// 정비 항목 수정
const updateMaintenanceData = async (req, res) => {
  const { items, records } = req.body;
  const { userId } = req;

  try {
    if (items) {
      await updateMaintenanceItems(items);
    }

    if (records) {
      await updateMaintenanceRecords(records);
    }

    res.json({ message: "정비 항목 및 기록이 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("업데이트 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "정비 항목 및 기록 업데이트 중 오류가 발생했습니다." });
  }
};

// 특정 사용자의 모든 정비 기록과 정비 항목 이름을 최신순으로 가져오는 API 핸들러
// controllers/maintenanceController.js

const getRecordsWithItems = async (req, res) => {
  const { userId } = req;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const records = await getMaintenanceRecordsWithItemsByUserId(
      userId,
      Number(page),
      Number(pageSize)
    );
    res.json(records);
  } catch (error) {
    console.error("정비 기록과 항목 가져오는 중 오류:", error);
    res.status(500).json({ error: "정비 기록 조회 중 오류가 발생했습니다." });
  }
};

module.exports = {
  getItemsWithRecords,
  addItem,
  addMaintenanceRecord,
  updateMaintenanceData,
  getRecordsWithItems, // 추가
};

module.exports = {
  getItemsWithRecords,
  addItem,
  addMaintenanceRecord,
  updateMaintenanceData,
  getRecordsWithItems,
};
