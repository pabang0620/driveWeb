import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useParams } from "react-router-dom";

const ExportToExcelButton = ({ userPermission }) => {
  // 백엔드에서 데이터를 가져오는 함수
  // 백엔드에서 데이터를 가져오는 함수
  const { userId } = useParams(); // useParams를 사용하여 userId를 가져옴

  const fetchDrivingLogData = async () => {
    try {
      if (userPermission !== 5) {
        const token = localStorage.getItem("token"); // 토큰이 있을 경우

        // userId가 있을 경우 경로에 추가
        const url = userId ? `/api/excel/${userId}` : "/api/excel"; // userId가 있으면 URL에 추가

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          },
        });
        return response.data;
      } else {
        alert("프리미엄 기능 입니다.");
      }
    } catch (error) {
      console.error("Error fetching driving log data:", error);
      return [];
    }
  };

  // 엑셀 파일 생성 및 다운로드 함수
  const exportToExcel = async () => {
    const data = await fetchDrivingLogData();

    // 데이터를 엑셀 형식으로 변환
    const worksheetData = [];

    const formatWorkingHours = (timeString) => {
      const time = new Date(timeString);
      const hours = time.getUTCHours();
      const minutes = time.getUTCMinutes();
      return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
    };

    data.forEach((log) => {
      log.driving_records.forEach((record) => {
        const row = {
          날짜: log.date,
          메모: log.memo || "", // memo가 비어있으면 빈 문자열로 처리
          "시작 시간": record.start_time,
          "종료 시간": record.end_time,
          "작업 시간": formatWorkingHours(record.working_hours), // 작업 시간 변환
          요일: record.day_of_week,
          "누적 거리 (km)": record.cumulative_km || 0, // null 값을 0으로 변환
          "주행 거리 (km)": record.driving_distance || 0,
          "영업 거리 (km)": record.business_distance || 0,
          "영업률 (%)": record.business_rate || 0,
          "연료 소모량 (L)": record.fuel_amount || 0,
          "연비 (km/L)": record.fuel_efficiency || 0,
          "총 운행 횟수": record.total_driving_cases || 0,
        };

        // 수입 기록 추가
        if (log.income_records.length > 0) {
          const income = log.income_records[0]; // 첫 번째 수입 기록
          row["카드 수입"] = income.card_income || 0;
          row["현금 수입"] = income.cash_income || 0;
          row["카카오 수입"] = income.kakao_income || 0;
          row["우버 수입"] = income.uber_income || 0;
          row["기타 수입"] = income.etc_income || 0;
          row["기타 수입1"] = income.income_spare_1 || 0;
          row["기타 수입2"] = income.income_spare_2 || 0;
          row["기타 수입3"] = income.income_spare_3 || 0;
          row["기타 수입4"] = income.income_spare_4 || 0;
          row["총 수입"] = income.total_income || 0;
          row["km당 수입"] = income.income_per_km || 0;
          row["시간당 수입"] = income.income_per_hour || 0;
        }

        // 지출 기록 추가
        if (log.expense_records.length > 0) {
          const expense = log.expense_records[0]; // 첫 번째 지출 기록
          row["연료 비용"] = expense.fuel_expense || 0;
          row["통행료"] = expense.toll_fee || 0;
          row["식사 비용"] = expense.meal_expense || 0;
          row["벌금 비용"] = expense.fine_expense || 0;
          row["기타 비용1"] = expense.expense_spare_1 || 0;
          row["기타 비용2"] = expense.expense_spare_2 || 0;
          row["기타 비용3"] = expense.expense_spare_3 || 0;
          row["기타 비용4"] = expense.expense_spare_4 || 0;
          row["카드 수수료"] = expense.card_fee || 0;
          row["카카오 수수료"] = expense.kakao_fee || 0;
          row["우버 수수료"] = expense.uber_fee || 0;
          row["총 지출"] = expense.total_expense || 0;
          row["순이익"] = expense.profit_loss || 0;
        }

        worksheetData.push(row);
      });
    });

    // 워크북 생성
    const workbook = XLSX.utils.book_new();

    // 데이터를 워크시트로 변환
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // 셀 스타일 적용 (헤더 스타일)
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4CAF50" } }, // 배경색 녹색
      alignment: { horizontal: "center" },
    };

    const cellStyle = {
      font: { color: { rgb: "000000" } },
      fill: { fgColor: { rgb: "E8F5E9" } }, // 배경색 옅은 녹색
    };

    // 엑셀의 첫 줄에 스타일 적용 (헤더에만 스타일 적용)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle; // 헤더 셀에 스타일 적용
    }

    // 모든 셀에 기본 스타일 적용
    Object.keys(worksheet).forEach((cellKey) => {
      if (worksheet[cellKey] && worksheet[cellKey].v) {
        worksheet[cellKey].s = cellStyle;
      }
    });

    // 워크시트 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, "운행 기록");

    // 엑셀 파일로 변환 및 다운로드
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "운행기록.xlsx");
  };

  return (
    <div className="excelbtnRelate">
      <button className="excelbtn" onClick={exportToExcel}>
        Excel 다운로드
      </button>
      <style jsx>{`
        .excelbtnRelate {
          position: relative;
        }
        .excelbtn {
          padding: 7px !important;
          background-color: #4caf50 !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 13px !important;
          position: absolute !important;
          top: -40px !important;
          right: 0px;
        }
        .excelbtn:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default ExportToExcelButton;
