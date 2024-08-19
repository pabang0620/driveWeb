import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";
import { useNavigate } from "react-router-dom";
import useCheckPermission from "../../utils/useCheckPermission";

function EstimatedIncomeTaxPage() {
  useCheckPermission();

  const [yearlyIncome, setYearlyIncome] = useState(0); // 연간 운송 수입금
  const [expenseRate, setExpenseRate] = useState(0); // 소득 정보 기준 경비율
  const [personalDeduction, setPersonalDeduction] = useState(0); // 본인 공제
  const [taxableIncome, setTaxableIncome] = useState(0); // 과세표준
  const [incomeTax, setIncomeTax] = useState(0); // 소득세
  const [localTax, setLocalTax] = useState(0); // 지방세
  const [estimatedTotalTax, setEstimatedTotalTax] = useState(0); // 예상 종합 소득세
  /*----효과----*/
  const [resultVisible, setResultVisible] = useState(false); // 결과 가시성 상태
  /*--------*/
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
    setResultVisible(false);
  };

  // 천 단위로 콤마를 추가하고 소수점을 제거한 금액 표시
  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString()}`;
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
    setEstimatedTotalTax(totalTax); // 상태 업데이트
    setResultVisible(true); // 결과를 표시하고 스크롤 이동

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
      // alert("예상 종합 소득세를 계산했습니다.");
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
          손익계산서 조회 <span>📊</span>
        </button>
      </div>
      <style jsx>{`
        .taxCulContainer {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          height: auto;

          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0 100px 0;
          }
          .taxCulContents {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            margin-top: 30px;
            @media (max-width: 768px) {
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              gap: 30px;
            }
          }
          .taxCulContent {
            padding: 3%;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 48%;
            @media (max-width: 768px) {
              width: 100%;
              padding: 8%;
            }
          }

          .taxCulInputGroup {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            @media (max-width: 768px) {
              margin-bottom: 10px;
            }
          }
          .taxCulInputGroup label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .taxCulInputGroup span {
            font-size: 16px;
            width: 40%;
            white-space: nowrap;
            @media (max-width: 1024px) {
              font-size: 14px;
              flex: 1;
            }
          }
          input,
          select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 45%;
            text-align: right;
            box-sizing: border-box;
            font-size: 16px;
            transition: border-color 0.3s;
            cursor: pointer;
            @media (max-width: 768px) {
              width: 40%;
              font-size: 14px;
            }
          }

          .taxCulButton {
            display: block;
            width: 100%;
            padding: 15px;
            background-color: #05aced;
            color: white;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.3s;
            @media (max-width: 1024px) {
              font-size: 14px;
              margin-top: 30px;
            }
          }
          .taxCulButton:hover {
            background-color: #69c2ef;
          }
          .taxCulResult {
            background-color: #05aced;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .estimatedTotalTax {
              width: 100%;
              text-align: center;
              h4 {
                font-weight: 500;
                font-size: 18px;
                color: white;
              }
              p {
                font-size: 20px;
                font-weight: 600;
                padding: 10px 0 30px 0;
                color: white;
                span {
                  font-size: 50px;
                  color: white;
                  font-weight: bold;
                  margin-right: 10px;
                }
                @media (max-width: 768px) {
                  padding: 10px 0 20px 0;
                }
              }
            }
            ul {
              background-color: #f6f6f6;
              border-radius: 8px;
              padding: 1% 3%;
              li {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                line-height: 40px;
                @media (max-width: 1024px) {
                  font-size: 14px;
                  line-height: 35px;
                  padding: 0 3%;
                }
                label {
                  text-align: left;
                  color: #555;
                }
                p {
                  text-align: right;
                  font-weight: 500;
                }
                &:not(:last-of-type) {
                  border-bottom: 1px solid #d9d9d9;
                }
              }
            }
          }
          .btnBox {
            width: 100%;
            height: 65px;
            box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
            position: fixed;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-between;
            @media (max-width: 1024px) {
              height: 50px;
            }
            button {
              width: 50%;
              height: 100%;
              line-height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 10px;
              height: 100%;
              background-color: white;
              font-size: 14px;
              cursor: pointer;
              @media (max-width: 1024px) {
                font-size: 13px;
              }
              &:nth-of-type(1) {
                span {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background-color: #05aced;
                  position: relative;
                  img {
                    width: 40%;
                    filter: brightness(0) invert(1);
                    z-index: 2;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-55%, -50%);
                  }
                }
              }
              &:nth-of-type(2) {
                border-left: 1px solid #f0f0f0;
              }
            }
          }
           {
            /* .taxCulResult div {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .taxCulResult div:last-child {
            border-bottom: none;
          } */
          }
        }
      `}</style>
    </div>
  );
}

export default EstimatedIncomeTaxPage;
