import { useSearchParams } from "react-router-dom";

export function FailPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        <p>문제가 발생했습니다. 다시 시도해 주세요.</p>
        <a href="/">홈으로 돌아가기</a>
        <p>{`에러 코드: ${searchParams.get("code")}`}</p>
        <p>{`실패 사유: ${searchParams.get("message")}`}</p>
      </div>
      <style jsx>{`
        .result.wrapper {
          background-color: rgb(244, 244, 244);
          padding: 100px 0;
          height: calc(100vh - 300px);
          position: relative;
          @media (max-width: 768px) {
            padding: 0;
          }

          .box_section {
            max-width: 350px;
            width: 70%;
            position: absolute;
            left: 50%;
            top: 50%;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            transform: translate(-50%, -50%);

            @media (max-width: 768px) {
              width: 100%;
              max-width: 100%;
              height: 100%;
              border-radius: 0px;
              box-shadow: 0 0 0;
              display: flex;
              flex-wrap: wrap;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          }

          h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: #e53935;
          }

          p {
            font-size: 16px;
            line-height: 25px;
            margin-bottom: 30px;
          }

          .navyBox {
            width: 100%;
            padding: 12px;
            background-color: #3c5997;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.3s;

            @media (max-width: 768px) {
              width: 70%;
              font-size: 16px;
            }
            a {
              color: white;
              display: inline-block;
              width: 100%;
              height: 100%;
            }
            &:hover {
              background-color: #7388b6;
            }
          }
        }
      `}</style>
    </div>
  );
}
