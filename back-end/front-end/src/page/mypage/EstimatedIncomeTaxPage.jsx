import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";
import { useNavigate } from "react-router-dom";
import "./mypage.scss";

function EstimatedIncomeTaxPage() {
  const [yearlyIncome, setYearlyIncome] = useState(0); // 연간 운송 수입금
  const [expenseRate, setExpenseRate] = useState(0); // 소득 정보 기준 경비율
  const [personalDeduction, setPersonalDeduction] = useState(0); // 본인 공제
  const [taxableIncome, setTaxableIncome] = useState(0); // 과세표준
  const [incomeTax, setIncomeTax] = useState(0); // 소득세
  const [localTax, setLocalTax] = useState(0); // 지방세
  const [estimatedTotalTax, setEstimatedTotalTax] = useState(0); // 예상 종합 소득세
  const [resultVisible, setResultVisible] = useState(false); // 결과 가시성 상태
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 선택된 연도
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModified, setIsModified] = useState(false); // 수정 여부 추적

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
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
        setPersonalDeduction(
          personalDeduction === 0 ? 1500000 : personalDeduction
        );
        setIsModified(false); // 데이터를 불러오면 수정 상태를 초기화
      } catch (err) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // 천 단위로 콤마를 추가하고 소수점을 제거한 금액 표시
  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}`;
  };

  // 입력된 값에 콤마를 넣지 않기 위해 숫자로 변환
  const parseCurrency = (value) => {
    return value.replace(/,/g, "");
  };

  const handleYearlyIncomeChange = (event) => {
    const value = parseCurrency(event.target.value);
    setYearlyIncome(Number(value));
    setIsModified(true);
  };

  const handleExpenseRateChange = (event) => {
    setExpenseRate(Number(event.target.value));
    setIsModified(true);
  };

  const handlePersonalDeductionChange = (event) => {
    const value = parseCurrency(event.target.value);
    setPersonalDeduction(Number(value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
    setResultVisible(false);
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

    const totalTax = Math.max(calculatedIncomeTax + calculatedLocalTax, 0); // 예상 종합 소득세가 음수면 0으로 처리
    setEstimatedTotalTax(totalTax);

    setResultVisible(true);

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

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="taxCulContainer">
      <TitleBox title="예상 종합소득세" subtitle="프리미엄 기능 ✨" />
      <div className="taxCulContents">
        <div className="taxCulContent taxCulDefault">
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
                type="text"
                value={formatCurrency(yearlyIncome)}
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
                type="text"
                value={formatCurrency(personalDeduction)}
                onChange={handlePersonalDeductionChange}
              />
            </label>
          </div>
          <button
            className="taxCulButton"
            onClick={calculateEstimatedTax}
            style={{
              backgroundColor: resultVisible ? "#ccc" : "#05aced",
              cursor: resultVisible ? "not-allowed" : "pointer",
            }}
          >
            예상 종합 소득세 보기
          </button>
        </div>

        <div
          className={`taxCulContent taxCulResult ${
            resultVisible ? "visible" : ""
          }`}
        >
          <div className="estimatedTotalTax">
            <h4>예상 종합 소득세</h4>
            <p>
              <span>{formatCurrency(estimatedTotalTax)}</span>원
            </p>
          </div>
          <ul>
            <li>
              <label>과세표준</label>
              <p>
                <span>{formatCurrency(taxableIncome)}</span>원
              </p>
            </li>
            <li>
              <label>소득세</label>
              <p>
                <span>{formatCurrency(incomeTax)}</span>원
              </p>
            </li>
            <li>
              <label>지방세</label>
              <p>
                <span>{formatCurrency(localTax)}</span>원
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="btnBox">
        <button className="backButton" onClick={() => navigate("/mypage")}>
          <span>
            <img
              src={`${process.env.PUBLIC_URL}/images/prevBtn.png`}
              alt="이전"
            />
          </span>
          마이페이지로 이동
        </button>
        <button onClick={() => navigate("/profit-loss-statement")}>
          손익계산서 조회 <span>💰</span>
        </button>
      </div>
    </div>
  );
}

export default EstimatedIncomeTaxPage;
