const XLSX = require("xlsx");
const {
  saveDrivingLog,
  getDrivingLogDataForExcelModel,
} = require("../models/excelModel");

// 운행 일지 데이터를 엑셀용으로 가져오기
const getDrivingLogsForExcel = async (req, res) => {
  const { userId } = req;
  try {
    const data = await getDrivingLogDataForExcelModel(userId);
    res.json(data); // 데이터를 JSON으로 클라이언트에 전송
  } catch (error) {
    console.error("Error generating excel data:", error);
    res.status(500).json({ error: "Failed to generate excel data" });
  }
};

// 엑셀 파일을 파싱하고 데이터베이스에 저장하는 컨트롤러
const uploadExcel = async (req, res) => {
  try {
    const { userId } = req;

    if (!req.file) {
      return res.status(400).json({ message: "엑셀 파일을 업로드해주세요." });
    }

    // 업로드된 엑셀 파일을 메모리에서 읽기
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 각 행을 데이터베이스에 저장
    for (const row of worksheet) {
      await saveDrivingLog(row, userId);
    }

    res
      .status(200)
      .json({ message: "엑셀 데이터가 성공적으로 업로드되었습니다." });
  } catch (error) {
    console.error("엑셀 업로드 중 오류:", error);
    res.status(500).json({ message: "엑셀 업로드 중 오류가 발생했습니다." });
  }
};

module.exports = {
  getDrivingLogsForExcel,
  uploadExcel,
};
