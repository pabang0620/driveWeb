import { useSearchParams } from "react-router-dom";
import "./payment.scss";

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
    </div>
  );
}
