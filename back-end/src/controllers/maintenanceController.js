const {
  createMaintenanceItem,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  getMaintenanceItemsWithRecords,
  getMaintenanceRecordsWithItemsByUserId,
  getLastMaintenanceRecord,
  findMaintenanceRecordById,
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
    const lastRecord = await getLastMaintenanceRecord(carId, userId);
    let edited = 0;
    if (
      lastRecord &&
      (lastRecord.maintenanceInterval !== maintenanceInterval ||
        lastRecord.maintenanceDistance !== maintenanceDistance)
    ) {
      edited = 1;
    }
    if (maintenanceCost > 0 && maintenanceMethod.trim() !== "") {
      edited = 2;
    }
    const data = {
      maintenanceItemId,
      maintenanceDate,
      maintenanceInterval,
      maintenanceDistance,
      maintenanceMethod,
      mileageAtMaintenance,
      maintenanceCost,
      carId,
      userId,
      edited,
    };

    const record = await createMaintenanceRecord(data);

    res.json({ record });
  } catch (error) {
    console.error("Error adding maintenance record:", error);
    res.status(500).json({ error: "정비 기록 추가 중 오류가 발생했습니다." });
  }
};
// -----------------------------------------
// 정비 항목 수정
const updateMaintenanceData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      maintenanceDate,
      maintenanceDistance,
      maintenanceMethod,
      mileageAtMaintenance,
      maintenanceCost,
    } = req.body;

    const maintenanceRecord = await findMaintenanceRecordById(id);

    if (!maintenanceRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    const updatedRecord = await updateMaintenanceRecord(id, {
      maintenanceDate,
      maintenanceDistance,
      maintenanceMethod,
      mileageAtMaintenance,
      maintenanceCost,
    });

    res.status(200).json({
      message: "Maintenance record updated successfully",
      maintenanceRecord: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 특정 사용자의 모든 정비 기록과 정비 항목 이름을 최신순으로 가져오는 API 핸들러
// controllers/maintenanceController.js

const getRecordsWithItems = async (req, res) => {
  const { userId } = req;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const { records, totalCount } =
      await getMaintenanceRecordsWithItemsByUserId(
        userId,
        Number(page),
        Number(pageSize)
      );
    res.json({
      records,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(pageSize)),
    });
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
  getRecordsWithItems,
};
