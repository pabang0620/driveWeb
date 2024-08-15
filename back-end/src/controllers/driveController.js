const {
  createDrivingRecord,
  updateIncomeRecord,
  getFranchiseFees,
  createOrUpdateExpenseRecord,
  findIncomeRecordByDrivingLogId,
  updateTotalIncome,
  updateExpenseRecordByDrivingLogId,
  calculateProfitLoss,
  getDrivingLogs,
  getDrivingLogDetails,
  filterZeroValues,
  // 운행일지 수정을 위한 get
  getDrivingLogWithRecords,
  getIncomeRecordByDrivingLogId,
  getExpenseRecordByDrivingLogId,
  // 운행일지 수정
  getDrivingRecordByLogId,
  updateDrivingRecord,
  updateDrivingLog,
  adjustMaintenanceRecords,
  isLatestDrivingLog,
  updateCumulativeKmInRelatedTables,
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
      total_driving_cases,
    } = req.body;

    // 계산을 위해 시간 파싱
    const parsedStartTime = new Date(`${date}T${start_time}`);
    const parsedEndTime = new Date(`${date}T${end_time}`);

    // DateTime 객체가 유효한지 확인
    if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    const result = await createDrivingRecord({
      userId,
      date,
      start_time,
      end_time,
      cumulative_km,
      business_distance,
      fuel_amount,
      memo,
      total_driving_cases,
      parsedStartTime,
      parsedEndTime,
    });

    console.log(3);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding driving record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editDrivingRecord = async (req, res) => {
  const { drivingLogId } = req.params; // driving_log_id
  const { userId } = req; // 인증 미들웨어에서 가져온 userId
  const {
    date,
    start_time,
    end_time,
    // cumulative_km,
    // business_distance,
    fuel_amount,
    memo,
    total_driving_cases,
  } = req.body;

  try {
    // 계산을 위해 시간 파싱
    const parsedStartTime = new Date(`${date}T${start_time}`);
    const parsedEndTime = new Date(`${date}T${end_time}`);

    if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    // 기존 운행 기록을 가져옴
    const existingDrivingRecord = await getDrivingRecordByLogId(drivingLogId);

    if (!existingDrivingRecord) {
      return res.status(404).json({ error: "운행 기록을 찾을 수 없습니다." });
    }

    // const previousDrivingDistance = existingDrivingRecord.driving_distance;
    // const newDrivingDistance = cumulative_km - previousDrivingDistance;

    const workingHoursMilliseconds = Math.abs(parsedEndTime - parsedStartTime);
    const workingHoursSeconds = Math.floor(workingHoursMilliseconds / 1000); // 초 단위로 변환

    const dayOfWeek = parsedStartTime.toLocaleString("en-US", {
      weekday: "long",
    });

    // const fuelEfficiency = newDrivingDistance / fuel_amount;
    // const businessRate = (business_distance / newDrivingDistance) * 100;

    // 운행 기록 업데이트
    const updatedDrivingRecord = await updateDrivingRecord(drivingLogId, {
      start_time,
      end_time,
      working_hours: new Date(workingHoursMilliseconds),
      working_hours_seconds: workingHoursSeconds,
      day_of_week: dayOfWeek,
      // driving_distance: newDrivingDistance,
      // business_distance: Number(business_distance),
      // business_rate: Number(businessRate),
      fuel_amount: Number(fuel_amount),
      // fuel_efficiency: Number(fuelEfficiency),
      total_driving_cases: Number(total_driving_cases),
      // cumulative_km: Number(cumulative_km),
    });

    // 운행 일지 업데이트
    const updatedDrivingLog = await updateDrivingLog(drivingLogId, {
      date,
      memo,
    });

    console.log(updatedDrivingRecord.working_hours);
    // 성공적으로 처리된 결과 반환
    res.status(200).json({
      driving_log_id: updatedDrivingLog.id,
      working_hours_seconds: workingHoursSeconds,
    });
  } catch (error) {
    console.error("Error updating driving record:", error);
    console.error("Stack trace:", error.stack); // 에러 스택을 출력하여 자세한 위치 확인

    res.status(500).json({ error: "내부 서버 오류가 발생했습니다." });
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
// 운행일지 수입

const editIncomeRecord = async (req, res) => {
  const { driving_log_id } = req.params;
  const { userId } = req; // 인증 미들웨어에서 설정된 userId
  const data = req.body;

  console.log(
    "editIncomeRecord - driving_log_id:",
    driving_log_id,
    "userId:",
    userId,
    "data:",
    data
  );

  try {
    // 수입 기록을 가져와서 userId를 확인합니다.
    const incomeRecord = await findIncomeRecordByDrivingLogId(driving_log_id);

    if (!incomeRecord) {
      return res
        .status(404)
        .json({ error: "해당 수입 기록을 찾을 수 없습니다." });
    }

    // 유저 ID를 사용해서 프랜차이즈 수수료를 가져옵니다.
    const franchiseFees = await getFranchiseFees(userId);

    // 수수료를 적용하여 data를 수정하고, 수수료 금액을 계산합니다.
    const feesMap = franchiseFees.reduce((acc, fee) => {
      acc[fee.franchise_name] = fee.fee;
      return acc;
    }, {});

    let totalFees = {
      card_fee: 0,
      kakao_fee: 0,
      uber_fee: 0,
      onda_fee: 0,
      tada_fee: 0,
      iam_fee: 0,
      etc_fee: 0,
    };

    // 수수료 적용 함수
    const applyFee = (amount, feeName, expenseField) => {
      let fee = feesMap[feeName] !== undefined ? feesMap[feeName] : 0;
      if (fee === 0 && feesMap[feeName.toUpperCase()] !== undefined) {
        fee = feesMap[feeName.toUpperCase()];
      }
      const feeAmount = parseFloat(amount) * (fee / 100);
      totalFees[expenseField] += feeAmount;
      // 수수료를 차감한 금액을 리턴하지 않음
      return amount;
    };

    // 수입에 대한 수수료만 계산하고, 원래 데이터를 유지합니다.
    if (data.card_income) {
      applyFee(data.card_income, "카드", "card_fee");
    }
    if (data.kakao_income) {
      applyFee(data.kakao_income, "카카오", "kakao_fee");
    }
    if (data.uber_income) {
      applyFee(data.uber_income, "우버", "uber_fee");
    }
    if (data.onda_income) {
      applyFee(data.onda_income, "온다", "onda_fee");
    }
    if (data.tada_income) {
      applyFee(data.tada_income, "타다", "tada_fee");
    }
    if (data.iam_income) {
      applyFee(data.iam_income, "아이엠", "iam_fee");
    }
    if (data.etc_income) {
      applyFee(data.etc_income, "기타", "etc_fee");
    }

    // 수수료를 적용한 데이터를 업데이트합니다.
    const record = await updateIncomeRecord(incomeRecord.id, data);

    // 수수료를 expense_records에 업데이트합니다.
    await createOrUpdateExpenseRecord(driving_log_id, totalFees);

    // total_income, income_per_km, income_per_hour 업데이트
    await updateTotalIncome(incomeRecord.id, data);

    res.status(200).json(record);
  } catch (error) {
    console.error("editIncomeRecord error:", error);
    res.status(500).json({ error: "수입 기록 수정 중 오류가 발생했습니다." });
  }
};

// 지출 기록
const editExpenseRecord = async (req, res) => {
  const { driving_log_id } = req.params;
  const data = req.body;

  try {
    const updatedRecord = await updateExpenseRecordByDrivingLogId(
      driving_log_id,
      data
    );

    // Profit and loss 계산
    await calculateProfitLoss(driving_log_id);

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("editExpenseRecord error:", error);
    res.status(500).json({ error: "지출 기록 수정 중 오류가 발생했습니다." });
  }
};

// get 시작
const getDrivingLogsForUser = async (req, res) => {
  const { userId } = req;

  try {
    const drivingLogs = await getDrivingLogs(userId);
    res.status(200).json(drivingLogs);
  } catch (error) {
    console.error("Error getting driving logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getDriveDetails = async (req, res) => {
  const { driving_log_id } = req.params;

  try {
    const drivingLog = await getDrivingLogDetails(driving_log_id);

    if (!drivingLog) {
      return res.status(404).json({ error: "Driving log not found" });
    }

    const incomeRecord = drivingLog.income_records[0];
    const expenseRecord = drivingLog.expense_records[0];

    const result = {
      id: drivingLog.id,
      memo: drivingLog.memo,
      date: drivingLog.date,
      driving_records: drivingLog.driving_records.map((record) => ({
        start_time: record.start_time,
        end_time: record.end_time,
        working_hours: record.working_hours,
        business_distance: record.business_distance,
        driving_distance: record.driving_distance,
        fuel_amount: record.fuel_amount,
        total_driving_cases: record.total_driving_cases,
        fuel_efficiency: record.fuel_efficiency,
        business_rate: record.business_rate,
        day_of_week: record.day_of_week,
      })),
      income_records: incomeRecord ? filterZeroValues(incomeRecord) : {},
      expense_records: expenseRecord ? filterZeroValues(expenseRecord) : {},
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching drive details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 운행일지 수정을 위한
const fetchDrivingLogWithRecords = async (req, res) => {
  const { driving_log_id } = req.params;
  try {
    const drivingLog = await getDrivingLogWithRecords(driving_log_id);

    if (!drivingLog) {
      return res.status(404).json({ error: "운행 일지를 찾을 수 없습니다." });
    }

    res.status(200).json(drivingLog);
  } catch (error) {
    console.error("Error fetching driving log with records:", error);
    res.status(500).json({ error: "내부 서버 오류가 발생했습니다." });
  }
};

// 수입 기록 가져오기
const fetchIncomeRecordByDrivingLogId = async (req, res) => {
  const { driving_log_id } = req.params;

  try {
    const incomeRecord = await getIncomeRecordByDrivingLogId(driving_log_id);

    if (!incomeRecord) {
      return res.status(404).json({ error: "수입 기록을 찾을 수 없습니다." });
    }

    res.status(200).json(incomeRecord);
  } catch (error) {
    console.error("Error fetching income record:", error);
    res.status(500).json({ error: "내부 서버 오류가 발생했습니다." });
  }
};

// 지출 기록 가져오기
const fetchExpenseRecordByDrivingLogId = async (req, res) => {
  const { driving_log_id } = req.params;

  try {
    const expenseRecord = await getExpenseRecordByDrivingLogId(driving_log_id);

    if (!expenseRecord) {
      return res.status(404).json({ error: "지출 기록을 찾을 수 없습니다." });
    }

    res.status(200).json(expenseRecord);
  } catch (error) {
    console.error("Error fetching expense record:", error);
    res.status(500).json({ error: "내부 서버 오류가 발생했습니다." });
  }
};

module.exports = {
  addDrivingRecord,
  editDrivingRecord,
  removeDrivingRecord,
  // ----------------
  editIncomeRecord,
  editExpenseRecord,
  // ---------------- get 시작
  getDrivingLogsForUser,
  getDriveDetails,
  // 운행일지 수정을 위한 get
  fetchDrivingLogWithRecords,
  fetchIncomeRecordByDrivingLogId,
  fetchExpenseRecordByDrivingLogId,
};
