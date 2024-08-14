import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";

function EstimatedIncomeTaxPage() {
  const [yearlyIncome, setYearlyIncome] = useState(0); // 연간 운송 수입금
  const [expenseRate, setExpenseRate] = useState(0); // 소득 정보 기준 경비율
  const [personalDeduction, setPersonalDeduction] = useState(0); // 본인 공제
  const [taxableIncome, setTaxableIncome] = useState(0); // 과세표준
  const [incomeTax, setIncomeTax] = useState(0); // 소득세
  const [localTax, setLocalTax] = useState(0); // 지방세
  const [estimatedTotalTax, setEstimatedTotalTax] = useState(0); // 예상 종합 소득세

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 선택된 연도
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModified, setIsModified] = useState(false); // 수정 여부 추적

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "/api", // 기본 API URL
    headers: {
      Authorization: `Bearer ${token}`, // 로컬 스토리지에서 토큰 가져오기
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/tax/estimatedIncomeTaxPage/${selectedYear}`
        );
        const { totalIncome, standardExpenseRate, personalDeduction } =
          response.data;

        setYearlyIncome(totalIncome);
        setExpenseRate(standardExpenseRate);
        setPersonalDeduction(personalDeduction);
        setIsModified(false); // 데이터를 불러오면 수정 상태를 초기화
      } catch (err) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleYearlyIncomeChange = (event) => {
    setYearlyIncome(Number(event.target.value));
    setIsModified(true);
  };

  const handleExpenseRateChange = (event) => {
    setExpenseRate(Number(event.target.value));
    setIsModified(true);
  };

  const handlePersonalDeductionChange = (event) => {
    setPersonalDeduction(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const calculateEstimatedTax = () => {
    const calculatedTaxableIncome =
      yearlyIncome - yearlyIncome * (expenseRate / 100) - personalDeduction;
    setTaxableIncome(calculatedTaxableIncome);

    const { taxRate, progressiveDeduction } = getTaxRateAndDeduction(
      calculatedTaxableIncome
    );

    const calculatedIncomeTax =
      calculatedTaxableIncome * taxRate - progressiveDeduction;
    setIncomeTax(calculatedIncomeTax);

    const calculatedLocalTax = calculatedIncomeTax * 0.1;
    setLocalTax(calculatedLocalTax);

    const totalTax = calculatedIncomeTax + calculatedLocalTax;
    setEstimatedTotalTax(totalTax);

    // 수정되지 않은 경우에만 서버로 전송
    if (!isModified) {
      saveTaxData(personalDeduction, totalTax);
    } else {
      alert("예상 종합 소득세를 계산했습니다.");
    }
  };

  const saveTaxData = async (personalDeduction, estimatedTotalTax) => {
    try {
      await api.put("/tax/income", {
        year: selectedYear,
        personalDeduction,
        estimatedTotalTax,
      });
      alert("예상 종합 소득세를 계산했습니다.");
    } catch (err) {
      console.error("데이터 저장 중 오류 발생:", err);
      alert("데이터 저장 중 오류가 발생했습니다.");
    }
  };

  const getTaxRateAndDeduction = (taxableIncome) => {
    if (taxableIncome <= 14000000) {
      return { taxRate: 0.06, progressiveDeduction: 0 };
    } else if (taxableIncome <= 50000000) {
      return { taxRate: 0.15, progressiveDeduction: 1260000 };
    } else if (taxableIncome <= 88000000) {
      return { taxRate: 0.24, progressiveDeduction: 5760000 };
    } else if (taxableIncome <= 150000000) {
      return { taxRate: 0.35, progressiveDeduction: 15440000 };
    } else if (taxableIncome <= 300000000) {
      return { taxRate: 0.38, progressiveDeduction: 19940000 };
    } else if (taxableIncome <= 500000000) {
      return { taxRate: 0.4, progressiveDeduction: 25940000 };
    } else if (taxableIncome <= 1000000000) {
      return { taxRate: 0.42, progressiveDeduction: 35940000 };
    } else {
      return { taxRate: 0.45, progressiveDeduction: 65940000 };
    }
  };

  // 천 단위로 콤마를 추가하고 소수점을 제거한 금액 표시
  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}원`;
  };

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="taxCulContainer">
      <TitleBox title="프리미엄 기능" subtitle="예상 종합소득세" />
      <div className="taxCulContent">
        <div className="taxCulInputGroup">
          <label>
            <span>연도 선택</span>
            <select value={selectedYear} onChange={handleYearChange}>
              <option value={2018}>2018</option>
              <option value={2019}>2019</option>
              <option value={2020}>2020</option>
              <option value={2021}>2021</option>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </label>
        </div>
        <div className="taxCulInputGroup">
          <label>
            <span>연간 운송 수입금</span>
            <input
              type="number"
              value={yearlyIncome}
              onChange={handleYearlyIncomeChange}
            />
          </label>
        </div>
        <div className="taxCulInputGroup">
          <label>
            <span>소득 정보 기준 경비율</span>
            <input
              type="number"
              value={expenseRate}
              onChange={handleExpenseRateChange}
            />
          </label>
        </div>
        <div className="taxCulInputGroup">
          <label>
            <span>본인 공제</span>
            <input
              type="number"
              value={personalDeduction}
              onChange={handlePersonalDeductionChange}
            />
          </label>
        </div>
        <button className="taxCulButton" onClick={calculateEstimatedTax}>
          예상 종합 소득세 보기
        </button>
        <div className="taxCulResult">
          <div>
            <span>과세표준:</span> <span>{formatCurrency(taxableIncome)}</span>
          </div>
          <div>
            <span>소득세:</span> <span>{formatCurrency(incomeTax)}</span>
          </div>
          <div>
            <span>지방세:</span> <span>{formatCurrency(localTax)}</span>
          </div>
          <div>
            <span>예상 종합 소득세:</span>{" "}
            <span>{formatCurrency(estimatedTotalTax)}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .taxCulContainer {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;
          .taxCulContent {
            margin-top: 30px;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .taxCulInputGroup {
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .taxCulInputGroup label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .taxCulInputGroup span {
            flex: 0 0 40%;
            font-weight: bold;
            font-size: 16px;
          }
          input,
          select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 60%;
            text-align: right;
            box-sizing: border-box;
            font-size: 16px;
            transition: border-color 0.3s;
          }
          input:focus,
          select:focus {
            border-color: #4caf50;
          }
          .taxCulButton {
            display: block;
            width: 100%;
            padding: 15px;
            background-color: #4caf50;
            color: white;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.3s;
          }
          .taxCulButton:hover {
            background-color: #45a049;
          }
          .taxCulResult {
            margin-top: 30px;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-size: 18px;
          }
          .taxCulResult div {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .taxCulResult div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </div>
  );
}

export default EstimatedIncomeTaxPage;
