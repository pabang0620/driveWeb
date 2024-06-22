const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 운행일지 - 운행  // 운행일지 - 운행 // 운행일지 - 운행 // 운행일지 - 운행
const createDrivingRecord = async (
  drivingLogId,
  startTime,
  endTime,
  cumulativeKm,
  businessDistance,
  fuelAmount,
  totalDrivingCases
) => {
  const startTimeObj = new Date(startTime);
  const endTimeObj = new Date(endTime);
  const workingHours = (endTimeObj - startTimeObj) / (1000 * 60 * 60); // 시간 단위로 계산

  // 요일 계산
  const dayOfWeek = startTimeObj.toLocaleString("en-US", { weekday: "long" });

  // 주행 거리 계산
  const drivingLog = await prisma.drivingLog.findUnique({
    where: { id: drivingLogId },
    include: { user: true },
  });

  const userVehicle = await prisma.user_vehicles.findFirst({
    where: { userId: drivingLog.userId },
  });

  const drivingDistance = cumulativeKm - userVehicle.mileage;

  // 연비 계산
  const fuelEfficiency = (drivingDistance / fuelAmount).toFixed(2);

  // 영업률 계산 (다른 로직 추가 예정)
  const businessRate = ((businessDistance / drivingDistance) * 100).toFixed(2);

  // 누적 KM 업데이트
  await prisma.user_vehicles.update({
    where: { id: userVehicle.id },
    data: { mileage: cumulativeKm },
  });

  await prisma.my_car.updateMany({
    where: { userId: drivingLog.userId },
    data: { mileage: cumulativeKm },
  });

  return await prisma.driving_records.create({
    data: {
      drivingLogId,
      startTime: startTimeObj,
      endTime: endTimeObj,
      workingHours,
      dayOfWeek,
      cumulativeKm,
      drivingDistance,
      businessDistance,
      businessRate,
      fuelAmount,
      fuelEfficiency,
      totalDrivingCases,
    },
  });
};
const updateDrivingRecord = async (id, data) => {
  return await prisma.driving_records.update({
    where: { id },
    data,
  });
};
const deleteDrivingRecord = async (id) => {
  return await prisma.driving_records.delete({
    where: { id },
  });
};

// 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입 // 운행일지 - 수입
const createIncomeRecord = async (data) => {
  const {
    drivingLogId,
    cardIncome,
    cashIncome,
    kakaoIncome,
    uberIncome,
    ondaIncome,
    tadaIncome,
    otherIncome,
    incomeSpare1,
    incomeSpare2,
    incomeSpare3,
    incomeSpare4,
  } = data;

  const drivingRecord = await prisma.driving_records.findUnique({
    where: { id: drivingLogId },
  });

  const drivingDistance = drivingRecord.drivingDistance;
  const workingHours = drivingRecord.workingHours;

  const totalIncome =
    (cardIncome || 0) +
    (cashIncome || 0) +
    (kakaoIncome || 0) +
    (uberIncome || 0) +
    (ondaIncome || 0) +
    (tadaIncome || 0) +
    (otherIncome || 0) +
    (incomeSpare1 || 0) +
    (incomeSpare2 || 0) +
    (incomeSpare3 || 0) +
    (incomeSpare4 || 0);

  const incomePerKm = totalIncome / drivingDistance;
  const incomePerHour = totalIncome / workingHours;

  return await prisma.incomeRecord.create({
    data: {
      drivingLogId,
      cardIncome,
      cashIncome,
      kakaoIncome,
      uberIncome,
      ondaIncome,
      tadaIncome,
      otherIncome,
      incomeSpare1,
      incomeSpare2,
      incomeSpare3,
      incomeSpare4,
      totalIncome,
      incomePerKm,
      incomePerHour,
    },
  });
};
const updateIncomeRecord = async (id, data) => {
  const {
    drivingLogId,
    cardIncome,
    cashIncome,
    kakaoIncome,
    uberIncome,
    ondaIncome,
    tadaIncome,
    otherIncome,
    incomeSpare1,
    incomeSpare2,
    incomeSpare3,
    incomeSpare4,
  } = data;

  const drivingRecord = await prisma.driving_records.findUnique({
    where: { id: drivingLogId },
  });

  const drivingDistance = drivingRecord.drivingDistance;
  const workingHours = drivingRecord.workingHours;

  const totalIncome =
    (cardIncome || 0) +
    (cashIncome || 0) +
    (kakaoIncome || 0) +
    (uberIncome || 0) +
    (ondaIncome || 0) +
    (tadaIncome || 0) +
    (otherIncome || 0) +
    (incomeSpare1 || 0) +
    (incomeSpare2 || 0) +
    (incomeSpare3 || 0) +
    (incomeSpare4 || 0);

  const incomePerKm = totalIncome / drivingDistance;
  const incomePerHour = totalIncome / workingHours;

  return await prisma.incomeRecord.update({
    where: { id },
    data: {
      cardIncome,
      cashIncome,
      kakaoIncome,
      uberIncome,
      ondaIncome,
      tadaIncome,
      otherIncome,
      incomeSpare1,
      incomeSpare2,
      incomeSpare3,
      incomeSpare4,
      totalIncome,
      incomePerKm,
      incomePerHour,
    },
  });
};
const deleteIncomeRecord = async (id) => {
  return await prisma.incomeRecord.delete({
    where: { id },
  });
};
// 운행일지 - 지출 // 운행일지 - 지출 // 운행일지 - 지출 // 운행일지 - 지출 // 운행일지 - 지출
const createExpenseRecord = async (data) => {
  const {
    drivingLogId,
    fuelCost,
    tollCost,
    mealCost,
    fineCost,
    otherExpense,
    expenseSpare1,
    expenseSpare2,
    expenseSpare3,
    expenseSpare4,
  } = data;

  // 가맹점 수수료 계산
  const franchiseFees = await prisma.franchiseFee.findMany({
    where: { userId: drivingLogId },
  });
  // 수수료 항목 정의 DB에도 정의
  // ALTER TABLE expense_records
  // ADD COLUMN cardFee FLOAT,
  // ADD COLUMN kakaoFee FLOAT,
  // ADD COLUMN uberFee FLOAT;

  const cardFee = franchiseFees.reduce(
    (acc, fee) => acc + (fee.franchiseName === "카드" ? fee.fee : 0),
    0
  );
  const kakaoFee = franchiseFees.reduce(
    (acc, fee) => acc + (fee.franchiseName === "카카오" ? fee.fee : 0),
    0
  );
  const uberFee = franchiseFees.reduce(
    (acc, fee) => acc + (fee.franchiseName === "우버" ? fee.fee : 0),
    0
  );
  const totalFranchiseFee = franchiseFees.reduce(
    (acc, fee) => acc + fee.fee,
    0
  );

  const totalExpense =
    cardFee +
    kakaoFee +
    uberFee +
    totalFranchiseFee +
    (fuelCost || 0) +
    (tollCost || 0) +
    (mealCost || 0) +
    (fineCost || 0) +
    (otherExpense || 0) +
    (expenseSpare1 || 0) +
    (expenseSpare2 || 0) +
    (expenseSpare3 || 0) +
    (expenseSpare4 || 0);

  const incomeRecord = await prisma.incomeRecord.findFirst({
    where: { drivingLogId },
  });

  const netIncome = (incomeRecord.totalIncome || 0) - totalExpense;

  return await prisma.expenseRecord.create({
    data: {
      drivingLogId,
      cardFee,
      kakaoFee,
      uberFee,
      franchiseFee: totalFranchiseFee,
      fuelCost,
      tollCost,
      mealCost,
      fineCost,
      otherExpense,
      expenseSpare1,
      expenseSpare2,
      expenseSpare3,
      expenseSpare4,
      totalExpense,
      netIncome,
    },
  });
};
const updateExpenseRecord = async (id, data) => {
  const {
    drivingLogId,
    fuelCost,
    tollCost,
    mealCost,
    fineCost,
    otherExpense,
    expenseSpare1,
    expenseSpare2,
    expenseSpare3,
    expenseSpare4,
  } = data;

  // 가맹점 수수료 계산
  const franchiseFees = await prisma.franchiseFee.findMany({
    where: { userId: drivingLogId },
  });

  const totalFranchiseFee = franchiseFees.reduce(
    (acc, fee) => acc + fee.fee,
    0
  );

  const totalExpense =
    totalFranchiseFee +
    (fuelCost || 0) +
    (tollCost || 0) +
    (mealCost || 0) +
    (fineCost || 0) +
    (otherExpense || 0) +
    (expenseSpare1 || 0) +
    (expenseSpare2 || 0) +
    (expenseSpare3 || 0) +
    (expenseSpare4 || 0);

  const incomeRecord = await prisma.incomeRecord.findFirst({
    where: { drivingLogId },
  });

  const netIncome = (incomeRecord.totalIncome || 0) - totalExpense;

  return await prisma.expenseRecord.update({
    where: { id },
    data: {
      franchiseFee: totalFranchiseFee,
      fuelCost,
      tollCost,
      mealCost,
      fineCost,
      otherExpense,
      expenseSpare1,
      expenseSpare2,
      expenseSpare3,
      expenseSpare4,
      totalExpense,
      netIncome,
    },
  });
};
const deleteExpenseRecord = async (id) => {
  return await prisma.expenseRecord.delete({
    where: { id },
  });
};

// Get Expense Records by Driving Log ID
const getExpenseRecordsByDrivingLogId = async (drivingLogId) => {
  return await prisma.expenseRecord.findMany({
    where: { drivingLogId },
  });
};
module.exports = {
  createDrivingRecord,
  updateDrivingRecord,
  deleteDrivingRecord,
  // -----------------------
  createIncomeRecord,
  updateIncomeRecord,
  deleteIncomeRecord,
  // ----------------------
  createExpenseRecord,
  updateExpenseRecord,
  deleteExpenseRecord,
};
