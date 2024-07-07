import React from "react";

const TermsPrivacy = () => {
  return (
    <div>
      <div className="container termsPrivacy-container">
        <div className="title">개인정보 수집∙이용 동의서</div>
        <p className="title_sub">
          본인은 귀사가 아래의 내용과 같이 본인의 개인 정보를 수집·이용하는데
          동의합니다.
        </p>
        <ul className="outer_list">
          <li className="section">
            <div className="section-title">수집하는 개인정보의 필수항목</div>
            <ul className="inner_list">
              <li>
                회원가입을 위해 필요한 개인정보: 이메일 주소(ID), 비밀번호
              </li>
              <li>
                서비스 이용 시 수집될 수 있는 정보: 서비스 이용 기록, 접속로그,
                쿠키, 접속 IP정보 등
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">개인정보의 수집 및 이용 목적</div>
            <ul className="inner_list">
              <li>
                홈페이지 회원가입 및 관리
                <br />
                회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
                회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인,
                서비스 부정이용 방지, 만14세 미만 아동 개인정보 수집 시
                법정대리인 동의 여부 확인, 각종 고지·통지, 고충처리, 분쟁 조정을
                위한 기록 보존 등
              </li>
              <li>
                민원사무 처리
                <br />
                민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지,
                처리결과 통보 등을 목적으로 개인정보 이용
              </li>
              <li>
                통계학적 분석
                <br />
                이용자의 성별, 연령별, 지역별, 소득별 통계분석, 통계분석서비스의
                유효성확인, 접속빈도 파악 또는 회원의 서비스 이용을 위하여
                개인정보 이용
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">개인정보 수집 방법</div>
            <ul className="inner_list">
              <li>
                서비스 이용/홈페이지/이메일/상담게시판 등을 통해 이용자가 직접
                입력/저장하는 정보 수집
              </li>
              <li>
                오프라인/콜센터/상담 등의 과정에서 서면/팩스/전화 등을 통해 수집
              </li>
              <li>생성정보 수집 툴을 통한 수집</li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">개인정보의 보유 및 이용기간</div>
            <ul className="inner_list">
              <li>
                회사는 원칙적으로 이용자의 개인정보를 회원 탈퇴 시 지체없이
                파기하고 있습니다.
              </li>
              <li>
                단, 관련 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는
                해당 기간 동안 개인정보를 안전하게 보관합니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <ul className="inner_list">
              <li>
                ※ 이용자는 개인정보의 수집 및 이용 동의를 거부할 권리가
                있습니다. 회원가입 시 수집하는 최소한의 개인정보, 즉, 필수
                항목에 대한 수집 및 이용 동의를 거부하실 경우 회원가입이 어려울
                수 있습니다.
              </li>
              <li>
                ※ 회사가 제공하는 서비스와 관련된 개인정보의 취급과 관련된
                사항은 회사의 개인정보처리방침에 따릅니다.
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .termsPrivacy-container {
          width: 80%;
          margin: 0 auto;
          padding: 80px 0;

          .title {
            font-size: 30px;
            font-weight: bold;
            color: #555;
            padding: 0;
          }
          .title_sub {
            font-size: 14px;
            margin-top: 20px;
          }
          .outer_list {
            padding-left: 5px;
            li {
              font-size: 14px;
              line-height: 20px;
            }
            > li:not(:last-of-type) {
              list-style-type: decimal; /* 숫자 */
              font-weight: bold;
              .inner_list li {
                list-style-type: disc; /* 원형 점 */
                font-weight: normal;
                margin-bottom: 10px;
              }
              &:last-of-type(1) {
                list-style: none;
              }
            }
          }

          .section {
            margin-top: 30px;
          }
          .section-title {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .content {
            font-size: 14px;
            line-height: 1.6;
            font-weight: normal;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsPrivacy;
