const {
  createDrivingRecord,
  updateDrivingRecord,
  deleteDrivingRecord,
  createIncomeRecord,
  updateIncomeRecord,
  deleteIncomeRecord,
} = require("../models/driveModel");

// 운행 일지 - 운행
// 운행 일지 - 운행
// 운행 일지 - 운행
// 운행 일지 - 운행
// 운행 일지 - 운행
const addDrivingRecord = async (req, res) => {
  const {
    drivingLogId,
    startTime,
    endTime,
    cumulativeKm,
    businessDistance,
    fuelAmount,
    totalDrivingCases,
  } = req.body;

  try {
    const record = await createDrivingRecord(
      drivingLogId,
      startTime,
      endTime,
      cumulativeKm,
      businessDistance,
      fuelAmount,
      totalDrivingCases
    );
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "운행 기록 생성 중 오류가 발생했습니다." });
  }
};
const editDrivingRecord = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const record = await updateDrivingRecord(Number(id), data);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: "운행 기록 수정 중 오류가 발생했습니다." });
  }
};
const removeDrivingRecord = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteDrivingRecord(Number(id));
    res.status(200).json({ message: "운행 기록이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "운행 기록 삭제 중 오류가 발생했습니다." });
  }
};

// 운행 일지 - 수입
// 운행 일지 - 수입
// 운행 일지 - 수입
// 운행 일지 - 수입
// 운행 일지 - 수입
const addIncomeRecord = async (req, res) => {
  const data = req.body;

  try {
    const incomeRecord = await createIncomeRecord(data);
    res.status(201).json(incomeRecord);
  } catch (error) {
    res.status(500).json({ error: "수입 기록 생성 중 오류가 발생했습니다." });
  }
};
const editIncomeRecord = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const incomeRecord = await updateIncomeRecord(Number(id), data);
    res.status(200).json(incomeRecord);
  } catch (error) {
    res.status(500).json({ error: "수입 기록 수정 중 오류가 발생했습니다." });
  }
};
const removeIncomeRecord = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteIncomeRecord(Number(id));
    res.status(200).json({ message: "수입 기록이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "수입 기록 삭제 중 오류가 발생했습니다." });
  }
};
// 운행 일지 - 지출
// 운행 일지 - 지출
// 운행 일지 - 지출
// 운행 일지 - 지출
// 운행 일지 - 지출
const addExpenseRecord = async (req, res) => {
  const data = req.body;

  try {
    const expenseRecord = await createExpenseRecord(data);
    res.status(201).json(expenseRecord);
  } catch (error) {
    res.status(500).json({ error: "지출 기록 생성 중 오류가 발생했습니다." });
  }
};
const editExpenseRecord = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const expenseRecord = await updateExpenseRecord(Number(id), data);
    res.status(200).json(expenseRecord);
  } catch (error) {
    res.status(500).json({ error: "지출 기록 수정 중 오류가 발생했습니다." });
  }
};
const removeExpenseRecord = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteExpenseRecord(Number(id));
    res.status(200).json({ message: "지출 기록이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "지출 기록 삭제 중 오류가 발생했습니다." });
  }
};

module.exports = {
  addDrivingRecord,
  editDrivingRecord,
  removeDrivingRecord,
  // ----------------
  addIncomeRecord,
  editIncomeRecord,
  removeIncomeRecord,
  // ----------------
  addExpenseRecord,
  editExpenseRecord,
  removeExpenseRecord,
};
