const {
  updateDrivingRecord,
  deleteDrivingRecord,
  createDrivingRecord,
  updateIncomeRecord,
  updateExpenseRecord,
} = require("../models/driveModel");

// 운행 일지 - 운행
// 운행 일지 - 운행
// 운행 일지 - 운행
// 운행 일지 - 운행
// 운행 일지 - 운행
const addDrivingRecord = async (req, res) => {
  const { userId } = req;
  try {
    const {
      date,
      start_time,
      end_time,
      cumulative_km,
      business_distance,
      fuel_amount,
      memo,
    } = req.body;

    console.log("Received date:", date);
    console.log("Received start_time:", start_time);
    console.log("Received end_time:", end_time);

    // 날짜와 시간을 결합하여 변환 및 유효성 검사
    const parsedDate = new Date(date);
    const parsedStartTime = new Date(`${date}T${start_time}`);
    const parsedEndTime = new Date(`${date}T${end_time}`);

    console.log("Parsed date:", parsedDate);
    console.log("Parsed start_time:", parsedStartTime);
    console.log("Parsed end_time:", parsedEndTime);

    if (
      isNaN(parsedDate.getTime()) ||
      isNaN(parsedStartTime.getTime()) ||
      isNaN(parsedEndTime.getTime())
    ) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    const result = await createDrivingRecord({
      userId,
      date: parsedDate,
      start_time: parsedStartTime,
      end_time: parsedEndTime,
      cumulative_km,
      business_distance,
      fuel_amount,
      memo,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding driving record:", error);
    res.status(500).json({ error: "Internal server error" });
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
// 운행일지 수입 부분 새벽 작업
const editIncomeRecord = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // 수입 기록을 가져와서 userId를 확인합니다.
    const incomeRecord = await findIncomeRecordById(id);

    if (!incomeRecord) {
      return res
        .status(404)
        .json({ error: "해당 수입 기록을 찾을 수 없습니다." });
    }

    // 유저 ID를 사용해서 프랜차이즈 수수료를 가져옵니다.
    const franchiseFees = await getFranchiseFees(incomeRecord.userId);

    // 수수료를 적용하여 data를 수정합니다.
    const feesMap = franchiseFees.reduce((acc, fee) => {
      acc[fee.franchise_name] = fee.fee;
      return acc;
    }, {});

    if (data.kakao_income) {
      const fee = feesMap["카카오"] !== undefined ? feesMap["카카오"] : 0;
      data.kakao_income = data.kakao_income * (1 - fee / 100);
    }
    if (data.uber_income) {
      const fee = feesMap["우버"] !== undefined ? feesMap["우버"] : 0;
      data.uber_income = data.uber_income * (1 - fee / 100);
    }
    if (data.onda_income) {
      const fee = feesMap["온다"] !== undefined ? feesMap["온다"] : 0;
      data.onda_income = data.onda_income * (1 - fee / 100);
    }
    if (data.tada_income) {
      const fee = feesMap["타다"] !== undefined ? feesMap["타다"] : 0;
      data.tada_income = data.tada_income * (1 - fee / 100);
    }

    // 수수료를 적용한 데이터를 업데이트합니다.
    const record = await updateIncomeRecord(Number(id), data);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: "수입 기록 수정 중 오류가 발생했습니다." });
  }
};

const editExpenseRecord = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const record = await updateExpenseRecord(Number(id), data);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: "지출 기록 수정 중 오류가 발생했습니다." });
  }
};

module.exports = {
  addDrivingRecord,
  editDrivingRecord,
  removeDrivingRecord,
  // ----------------
  updateIncomeRecord,
  updateExpenseRecord,
  // ----------------
  editIncomeRecord,
  editExpenseRecord,
  // ----------------
};
