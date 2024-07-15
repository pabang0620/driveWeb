const {
  getMaintenanceItems,
  createMaintenanceItem,
  createMaintenanceRecord,
  updateMaintenanceItem,
  updateMaintenanceRecord,
} = require("../models/maintenanceModel");

// 정비 항목 조회
const getItems = async (req, res) => {
  const { userId } = req;
  try {
    const items = await getMaintenanceItems(userId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "정비 항목 조회 중 오류가 발생했습니다." });
  }
};

// 정비 항목 추가 및 정비 기록 자동 생성
const addItem = async (req, res) => {
  const {
    name,
    description,
    carId,
    maintenanceDate,
    maintenanceMileage,
    maintenanceMethod,
    currentMileage,
    cost,
  } = req.body;
  const { userId } = req;
  try {
    // 정비 항목 생성
    const item = await createMaintenanceItem({ name, description, userId });

    // 정비 기록 자동 생성
    const record = await createMaintenanceRecord({
      userId,
      carId,
      maintenanceItemId: item.id,
      maintenanceDate: new Date(maintenanceDate),
      maintenanceMileage,
      maintenanceMethod,
      currentMileage,
      cost,
    });

    res.json({ item, record });
  } catch (error) {
    res
      .status(500)
      .json({ error: "정비 항목 및 기록 추가 중 오류가 발생했습니다." });
  }
};

// 정비 기록 추가
const addRecord = async (req, res) => {
  const {
    carId,
    maintenanceItemId,
    maintenanceDate,
    maintenanceMileage,
    maintenanceMethod,
    currentMileage,
    cost,
  } = req.body;
  const userId = req.userId;
  try {
    const record = await createMaintenanceRecord({
      userId,
      carId,
      maintenanceItemId,
      maintenanceDate: new Date(maintenanceDate),
      maintenanceMileage,
      maintenanceMethod,
      currentMileage,
      cost,
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "정비 기록 추가 중 오류가 발생했습니다." });
  }
};

// 정비 항목 수정
const updateItem = async (req, res) => {
  const { id, name, description } = req.body;
  try {
    const item = await updateMaintenanceItem(Number(id), { name, description });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "정비 항목 수정 중 오류가 발생했습니다." });
  }
};

// 정비 기록 수정
const updateRecord = async (req, res) => {
  const {
    id,
    maintenanceDate,
    maintenanceMileage,
    maintenanceMethod,
    currentMileage,
    cost,
  } = req.body;
  try {
    const record = await updateMaintenanceRecord(Number(id), {
      maintenanceDate: new Date(maintenanceDate),
      maintenanceMileage,
      maintenanceMethod,
      currentMileage,
      cost,
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "정비 기록 수정 중 오류가 발생했습니다." });
  }
};

module.exports = {
  getItems,
  addItem,
  addRecord,
  updateItem,
  updateRecord,
};
