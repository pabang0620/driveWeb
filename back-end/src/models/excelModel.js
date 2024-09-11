const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 운행 일지 데이터 가져오기
const getDrivingLogDataForExcelModel = async (userId) => {
  try {
    const drivingLogs = await prisma.driving_logs.findMany({
      where: { userId: Number(userId) },
      select: {
        date: true,
        memo: true,
        driving_records: {
          select: {
            start_time: true,
            end_time: true,
            working_hours: true,
            day_of_week: true,
            cumulative_km: true,
            driving_distance: true,
            business_distance: true,
            business_rate: true,
            fuel_amount: true,
            fuel_efficiency: true,
            total_driving_cases: true,
          },
        },
        income_records: {
          select: {
            card_income: true,
            cash_income: true,
            kakao_income: true,
            uber_income: true,
            etc_income: true,
            other_income: true,
            income_spare_1: true,
            income_spare_2: true,
            income_spare_3: true,
            income_spare_4: true,
            total_income: true,
            income_per_km: true,
            income_per_hour: true,
          },
        },
        expense_records: {
          select: {
            fuel_expense: true,
            toll_fee: true,
            meal_expense: true,
            fine_expense: true,
            other_expense: true,
            expense_spare_1: true,
            expense_spare_2: true,
            expense_spare_3: true,
            expense_spare_4: true,
            total_expense: true,
            profit_loss: true,
            card_fee: true,
            kakao_fee: true,
            uber_fee: true,
          },
        },
      },
    });

    return drivingLogs;
  } catch (error) {
    console.error("Error fetching driving log data:", error);
    throw error;
  }
};
const convertTimeToISO = (timeString) => {
  const timeParts = timeString.split(" ");
  const hours = parseInt(timeParts[0].replace("시간", "")) || 0;
  const minutes = timeParts[1] ? parseInt(timeParts[1].replace("분", "")) : 0;
  return new Date(Date.UTC(1970, 0, 1, hours, minutes)).toISOString();
};

// "n시간 n분"을 초로 변환하는 함수
const convertTimeToSeconds = (timeString) => {
  const timeParts = timeString.split(" ");
  const hours = parseInt(timeParts[0].replace("시간", "")) || 0;
  const minutes = timeParts[1] ? parseInt(timeParts[1].replace("분", "")) : 0;
  return hours * 3600 + minutes * 60;
};

// 요일을 한국어로 변환하는 함수
const convertDayToKorean = (dayOfWeek) => {
  const dayMap = {
    Sunday: "일요일",
    Monday: "월요일",
    Tuesday: "화요일",
    Wednesday: "수요일",
    Thursday: "목요일",
    Friday: "금요일",
    Saturday: "토요일",
  };
  return dayMap[dayOfWeek] || dayOfWeek;
};

const saveDrivingLog = async (data, userId) => {
  try {
    await prisma.driving_logs.create({
      data: {
        date: data.날짜,
        memo: data.메모,
        users: {
          connect: { id: userId }, // userId를 이용하여 users 테이블과 연결
        },
        driving_records: {
          create: {
            start_time: data["시작 시간"],
            end_time: data["종료 시간"],
            working_hours: convertTimeToISO(data["작업 시간"]), // "n시간 n분"을 ISO로 변환
            working_hours_seconds: convertTimeToSeconds(data["작업 시간"]), // "n시간 n분"을 초로 변환
            day_of_week: data["요일"], // 요일을 한국어로 변환
            cumulative_km: parseFloat(data["누적 거리 (km)"]),
            driving_distance: parseFloat(data["주행 거리 (km)"]),
            business_distance: parseFloat(data["영업 거리 (km)"]),
            business_rate: parseFloat(data["영업률 (%)"]),
            fuel_amount: parseFloat(data["연료 소모량 (L)"]),
            fuel_efficiency: parseFloat(data["연비 (km/L)"]),
            total_driving_cases: parseInt(data["총 운행 횟수"]),
          },
        },
        income_records: {
          create: {
            card_income: parseFloat(data["카드 수입"]) || 0,
            cash_income: parseFloat(data["현금 수입"]) || 0,
            kakao_income: parseFloat(data["카카오 수입"]) || 0,
            uber_income: parseFloat(data["우버 수입"]) || 0,
            etc_income: parseFloat(data["기타 수입"]) || 0,
            income_spare_1: parseFloat(data["기타 수입1"]) || 0,
            income_spare_2: parseFloat(data["기타 수입2"]) || 0,
            income_spare_3: parseFloat(data["기타 수입3"]) || 0,
            income_spare_4: parseFloat(data["기타 수입4"]) || 0,
            total_income: parseFloat(data["총 수입"]) || 0,
            income_per_km: parseFloat(data["km당 수입"]) || 0,
            income_per_hour: parseFloat(data["시간당 수입"]) || 0,
          },
        },
        expense_records: {
          create: {
            fuel_expense: parseFloat(data["연료 비용"]) || 0,
            toll_fee: parseFloat(data["통행료"]) || 0,
            meal_expense: parseFloat(data["식사 비용"]) || 0,
            fine_expense: parseFloat(data["벌금 비용"]) || 0,
            expense_spare_1: parseFloat(data["기타 비용1"]) || 0,
            expense_spare_2: parseFloat(data["기타 비용2"]) || 0,
            expense_spare_3: parseFloat(data["기타 비용3"]) || 0,
            expense_spare_4: parseFloat(data["기타 비용4"]) || 0,
            card_fee: parseFloat(data["카드 수수료"]) || 0,
            kakao_fee: parseFloat(data["카카오 수수료"]) || 0,
            uber_fee: parseFloat(data["우버 수수료"]) || 0,
            total_expense: parseFloat(data["총 지출"]) || 0,
            profit_loss: parseFloat(data["순이익"]) || 0,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(
      "데이터베이스 저장 중 오류가 발생했습니다: " + error.message
    );
  }
};

module.exports = {
  getDrivingLogDataForExcelModel,
  saveDrivingLog,
};
