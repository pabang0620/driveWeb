import React from "react";

const TermsPrivacy = () => {
  return (
    <div>
      <div className="container termsPrivacy-container">
        <div className="title">개인정보 처리방침</div>
        <ul className="outer_list">
          {/* 제1조 총칙 */}
          <li className="section">
            <div className="section-title">제1조 총칙</div>
            <p className="section-text">
              국민대부㈜(이하 ‘회사’)가 제공하는 서비스
              “운행일지”('krdriver.com' 이하 '운행일지')는 「개인정보 보호법」
              제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을
              신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
              개인정보 처리방침을 수립·공개합니다.
            </p>
          </li>

          {/* 제2조 개인정보의 처리 목적 */}
          <li className="section">
            <div className="section-title">제2조 개인정보의 처리 목적</div>
            <p className="section-text">
              운행일지는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
              있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용
              목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의
              동의를 받는 등 필요한 조치를 이행할 예정입니다
            </p>
            <ul className="inner_list decimal_list">
              <li>
                회원제 서비스 제공에 따른 본인 식별, 인증 목적으로 개인정보를
                처리합니다.
              </li>
              <li>회원의 유료서비스 이용을 위하여 개인정보를 처리합니다.</li>
            </ul>
          </li>

          {/* 제3조 개인정보의 처리 및 보유 기간 */}
          <li className="section">
            <div className="section-title">
              제3조 개인정보의 처리 및 보유 기간
            </div>
            <p className="section-text">
              회사는 회원 가입일로부터 서비스를 제공하는 기간 동안에 한하여
              이용자의 개인정보를 보유 및 이용하게 됩니다. 회원탈퇴를 요청하거나
              개인정보의 수집 및 이용에 대한 동의를 철회하는 경우, 수집 및 이용
              목적이 달성되거나 보유 및 이용 기간이 종료한 경우 해당 개인정보를
              지체 없이 파기합니다. 관계법령의 규정에 의하여 보존할 필요가 있는
              경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안
              회원정보를 보관합니다.
            </p>
            <ul className="inner_list circle_list">
              <li>
                회사는 고객이 탈회하거나, 고객을 제명하는 경우 권리남용,
                악용방지, 권리침해/명예훼손 분쟁 및 수사협조 의뢰에 대비하여
                이용계약 해지일로부터 3년동안 개인정보를 보존합니다.
                <ul className="decimal_list">
                  <li>
                    개인정보: 아이디(ID), 비밀번호, 성명, 생년월일, e-mail 주소,
                    서비스 이용 기록, 접속로그, 쿠키, 접속 IP정보 등
                  </li>
                </ul>
              </li>
              <li>
                회사는 관련법령에 의한 정보보유 사유가 있는 경우 다음의 정보에
                대해서 명시한 기간 동안 보존합니다.
                <ul className="decimal_list">
                  <li>
                    계약 또는 청약철회 등에 관한 기록 보존근거: 전자상거래
                    등에서 소비자 보호에 관한 법률 (보존기간: 5년)
                  </li>
                  <li>
                    자금의 이체 및 상환에 관한 기록 보존근거: 전자상거래 등에서
                    소비자 보호에 관한 법률 (보존기간: 5년)
                  </li>
                  <li>
                    회원의 불만 또는 분쟁처리에 관한 기록 보존근거: 전자상거래
                    등에서 소비자 보호에 관한 법률 (보존기간: 3년)
                  </li>
                  <li>
                    표시/광고에 관한 기록 보존 근거: 전자상거래 등에서 소비자
                    보호에 관한 법률 (보존기간: 6개월)
                  </li>
                  <li>
                    본인 확인에 관한 기록 보존 근거: 정보통신망 이용촉진 및
                    정보보호 등에 관한 법률 (보존기간: 6개월)
                  </li>
                  <li>
                    방문에 관한 기록 보존 근거: 통신비밀보호법 (보존기간: 3개월)
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* 제4조 처리하는 개인정보의 항목 */}
          <li className="section">
            <div className="section-title">제4조 처리하는 개인정보의 항목</div>
            <ul className="inner_list decimal_list">
              <li>
                운행일지는 다음의 개인정보 항목을 처리하고 있습니다.
                <ul className="disc_list">
                  <li>필수항목: 이메일, 실명, 생년월일, 연락처</li>
                  <li>선택항목: 없음</li>
                </ul>
              </li>
            </ul>
          </li>

          {/* 제5조 개인정보의 파기절차 및 파기방법 */}
          <li className="section">
            <div className="section-title">
              제5조 개인정보의 파기절차 및 파기방법
            </div>
            <ul className="inner_list decimal_list">
              <li>
                운행일지는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </li>
              <li>
                정보주체로부터 동의받은 개인정보 보유기간이 경과하거나
                처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를
                계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의
                데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
              </li>
              <li>
                개인정보 파기의 절차 및 방법은 다음과 같습니다.
                <ul className="disc_list">
                  <li>
                    파기절차
                    <br />
                    운행일지는 파기 사유가 발생한 개인정보를 선정하고,
                    운행일지의 개인정보 보호책임자의 승인을 받아 개인정보를
                    파기합니다.
                  </li>
                  <li>
                    파기방법 <br />
                    전자적 파일 형태의 정보는 기록된 데이터베이스에서 해당
                    자료를 영구히 삭제합니다.
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* 제6조 정보주체와 법정대리인의 권리,의무 및 그 행사방법에 관한 사항 */}
          <li className="section">
            <div className="section-title">
              제6조 정보주체와 법정대리인의 권리, 의무 및 그 행사방법에 관한
              사항
            </div>
            <ul className="inner_list decimal_list">
              <li>
                정보주체는 “운행일지”에 대해 언제든지 개인정보
                열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
              </li>
              <li>
                제1항에 따른 권리 행사는 “운행일지”에 대해 「개인정보 보호법」
                시행령 제41조제1항에 따라 서면, 전자우편 등을 통하여 하실 수
                있으며 “운행일지”은(는) 이에 대해 지체 없이 조치하겠습니다.
              </li>
              <li>
                제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은
                자 등 대리인을 통하여 하실 수 있습니다. 이 경우 “개인정보 처리
                방법에 관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을
                제출하셔야 합니다.
              </li>
              <li>
                개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조
                제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수
                있습니다.
              </li>
              <li>
                개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집
                대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
              </li>
              <li>
                “운행일지는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구,
                처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한
                대리인인지를 확인합니다.
              </li>
            </ul>
          </li>

          {/* 제7조 개인정보의 안전성 확보조치에 관한 사항 */}
          <li className="section">
            <div className="section-title">
              제7조 개인정보의 안전성 확보조치에 관한 사항
            </div>
            <p className="section-text">
              개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한
              기술적, 관리적 및 물리적 조치를 하고 있습니다.
            </p>
            <ul className="inner_list circle_list">
              <li>
                개인정보 취급직원의 최소화 및 교육: 개인정보를 취급하는 직원을
                지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을
                시행하고 있습니다.
              </li>
              <li>
                내부관리계획의 수립 및 시행: 개인정보의 안전한 처리를 위하여
                내부관리계획을 수립하고 시행하고 있습니다.
              </li>
              <li>
                개인정보의 암호화: 이용자의 개인정보는 비밀번호는 암호화 되어
                저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는
                파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는
                등의 별도 보안기능을 사용하고 있습니다.
              </li>
              <li>
                해킹 등에 대비한 기술적 대책: “운행일지”는 해킹이나 컴퓨터
                바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여
                보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터
                접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및
                차단하고 있습니다.
              </li>
              <li>
                개인정보에 대한 접근 제한: 개인정보를 처리하는
                데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여
                개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며
                침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고
                있습니다.
              </li>
              <li>
                문서보안을 위한 잠금장치 사용: 개인정보가 포함된 서류,
                보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고
                있습니다.
              </li>
              <li>
                비인가자에 대한 출입 통제: 개인정보를 보관하고 있는 물리적 보관
                장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고
                있습니다.
              </li>
            </ul>
          </li>

          {/* 제8조 개인정보 보호책임자에 관한 사항 */}
          <li className="section">
            <div className="section-title">
              제8조 개인정보를 자동으로 수집하는 장치의 설치,운영 및 그 거부에
              관한 사항
            </div>
            <p className="section-text">
              회사는 고객의 정보를 수시로 저장하고 불러오는 쿠키(cookie)를
              운용합니다. 쿠키란 회사의 웹사이트를 운영하는데 이용되는 서버가
              이용자의 컴퓨터 브라우저에 보내는 아주 작은 텍스트 파일이며
              이용자의 컴퓨터 하드디스크에 저장되기도 합니다.
            </p>
            <ul className="inner_list circle_list">
              <li>
                쿠키의 사용목적: 회원과 비회원의 접속빈도나 방문시간 등을 분석,
                이용자의 취향과 관심분야를 파악하여 웹페이지 맞춤설정 및
                웹페이지 탐색 등에 대한 고객편의 제공 목적
              </li>
              <li>
                쿠키의 설치, 운영 및 거부: 고객은 쿠키 설치에 대한 선택권을
                가지고 있습니다. 따라서, 고객은 웹 브라우저에서 옵션을
                설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을
                거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다. 단,
                귀하가 쿠키 설치를 거부하였을 경우 일부 서비스 제공에 어려움이
                있을 수 있습니다.
              </li>
            </ul>
          </li>

          {/* 제9조 개인정보 열람청구 */}
          <li className="section">
            <div className="section-title">제9조 개인정보 열람청구</div>
            <ul className="inner_list decimal_list">
              <li>
                “운행일지”은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을
                위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                <ul className="disc_list">
                  <li>
                    개인정보 보호책임자 <br />
                    <br />
                    성명 : 김재청
                    <br />
                    직책 : 대표자
                    <br />
                    연락처 : 010-3194-36033, kr.taxi.master@gmail.com
                  </li>
                </ul>
              </li>
              <li>
                정보주체께서는 운행일지를 이용하시면서 발생한 모든 개인정보 보호
                관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보
                보호책임자 및 담당부서로 문의하실 수 있습니다. 운행일지는
                정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
              </li>
            </ul>
          </li>

          {/* 제10조 권익침해 구제방법 */}
          <li className="section">
            <div className="section-title">제10조 권익침해 구제방법</div>
            <p className="section-text">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여
              개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
              분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
              개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
              바랍니다.
            </p>
            <ul className="inner_list decimal_list">
              <li>
                개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
              </li>
              <li>
                개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
              </li>
              <li>대검찰청 : (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)</li>
            </ul>
            <p className="section-text">
              「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의
              정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대
              하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는
              이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을
              청구할 수 있습니다.
            </p>
            <p className="section-text">
              ※ 행정심판에 대해 자세한 사항은
              중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기
              바랍니다.
            </p>
          </li>

          {/* 제11조 영상정보처리기기 설치·운영 */}
          <li className="section">
            <div className="section-title">제11조 개인정보 처리방침 변경</div>
            <ul className="inner_list circle_list">
              <li>
                회사의 개인정보처리방침은 정부의 법률 및 지침 변경이나 회사의
                내부 방침 변경 등으로 인하여 변경될 수 있고, 이 경우 회사는
                개인정보처리방침 변경 시행 최소 7일전부터 홈페이지 공지사항을
                통하여 공지하고 개정일자 등을 부여하여 개정사항을 이용자들이
                쉽게 알아볼 수 있도록 할 것입니다.
              </li>
              <li>
                이용자 본인의 부주의나 인터넷상의 문제로 아이디, 비밀번호,
                주민등록번호 등 개인정보가 유출되어 발생한 문제에 대해 회사는
                일체의 책임을 지지 않으며, 회사의 사이트에 링크되어 있는
                웹사이트들이 개인정보를 수집하는 행위에 대해서는 본
                개인정보처리방침이 적용되지 않음을 알려 드립니다.
              </li>
            </ul>
            <p className="section-text">
              {"<부칙>"}
              <br />
              시행일 본 개인정보처리방침은 2024년 9월 1일부터 시행됩니다.
            </p>
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

          .outer_list {
            padding-left: 15px;
            li {
              font-size: 14px;
              line-height: 20px;
            }
            > li:not(:last-of-type) {
              font-weight: bold;
              p {
                margin: 10px 0;
                font-weight: normal;
              }
              .inner_list {
                list-style: none;
                li {
                  font-weight: normal;
                  margin-bottom: 10px;
                }
              }
              .decimal_list {
                margin: 10px 0 10px 30px;
                > li {
                  list-style-type: decimal;
                }
              }

              .circle_list {
                counter-reset: list-item;
                list-style-type: none;
                > li {
                  counter-increment: list-item;
                  list-style-type: none; /* 기본 숫자 제거 */
                  margin-left: 30px;
                  position: relative;
                  &::before {
                    content: counter(list-item);

                    position: absolute;
                    left: -20px;
                    top: 4px;
                    width: 11px;
                    height: 11px;
                    border: 1px solid #000;
                    color: #000;
                    border-radius: 50%;
                    background-color: #fff;
                    text-align: center;
                    line-height: 10px;
                    font-size: 10px;
                  }
                }
              }
              .disc_list {
                margin: 10px 0 10px 30px;
                li {
                  list-style-type: disc; /* 원형 점 */
                }
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
          .section-text {
            font-size: 14px;
            margin-top: 10px;
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
