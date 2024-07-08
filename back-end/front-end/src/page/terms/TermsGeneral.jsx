import React from "react";

const TermsGeneral = () => {
  return (
    <div>
      <div className="container termsPrivacy-container">
        <div className="title">이용약관</div>

        <ul className="outer_list">
          <li>
            <div className="section-title">목차</div>
            <ul className="inner_list">
              <li>제1조 (목적)</li>
              <li>제2조 (용어의 정의)</li>
              <li>제3조 (약관의 적용)</li>
              <li>제4조 (서비스의 종류)</li>
              <li>제5조 (이용계약의 성립 등)</li>
              <li>제6조 (회원가입)</li>
              <li>제7조 (회원정보의 보호)</li>
              <li>제8조 (회사의 의무)</li>
              <li>제9조 (회원의 의무)</li>
              <li>제10조 (서비스 이용권리의 양도 등)</li>
              <li>제11조 (계약해지 및 이용제한)</li>
              <li>제12조 (서비스 변경 및 중지)</li>
              <li>제13조 (전자메일 등에 대한 회원의 의무와 책임)</li>
              <li>제14조 (게시물 등의 관리)</li>
              <li>제15조 (링크)</li>
              <li>제16조 (면책)</li>
              <li>제17조 (저작권의 귀속 및 이용제한)</li>
              <li>제18조 (약관의 효력 및 변경)</li>
              <li>제19조 (약관 위반 시 책임)</li>
              <li>제20조 (약관 외 준칙)</li>
              <li>제21조 (포인트)</li>
              <li>제22조 (정보의 제공)</li>
              <li>제23조 (분쟁해결)</li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제1조 (목적)</div>
            <p>
              이 약관은 주식회사 에잇퍼센트(이하 ‘회사’)가 제공하는
              온라인연계투자금융 및 관련 서비스를 이용함에 있어 회사와 이용자
              사이의 권리와 의무, 책임 기타 필요한 사항을 규정함을 목적으로
              합니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제2조 (용어의 정의)</div>
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul className="inner_list">
              <li>
                ‘온라인’이란 회사의 대표 홈페이지(www.8percent.kr), 회사가 직접
                운영하는 홈페이지, 모바일 앱 등 회사가 제공하는 서비스를 이용할
                수 있는 모든 채널을 말합니다.
              </li>
              <li>
                ‘서비스’란 회사가 온라인에서 제공하는 온라인연계투자금융 서비스
                및 이와 관련된 제반 서비스를 말합니다.
              </li>
              <li>
                ‘회원’이란 온라인에서 이 약관에 동의하고 서비스를 이용하는 자를
                말합니다.
              </li>
              <li>
                ‘아이디(ID)’란 회원 식별과 회원의 서비스 이용을 위하여 회원
                본인이 설정하며, 회사가 정한 작성기준에 따라 설정된 것을
                말합니다.
              </li>
              <li>
                ‘비밀번호’란 회원 본인임을 확인하고 회원의 개인정보보호 또는
                비밀번호 및 서비스에 제공되는 각종 정보의 보안을 위해 회원
                본인이 설정하며, 회사가 정한 적성기준에 따라 설정된 문자, 숫자
                및 특수문자의 조합을 말합니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제3조 (약관의 적용)</div>
            <p>
              이 약관은 서비스를 이용하는 모든 회원에게 적용됩니다. 다만,
              채널별로 다르게 제공되는 서비스 이용에 대하여는 각 채널에 해당하는
              별도 약관이 함께 적용됩니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제4조 (서비스의 종류)</div>
            <p>회사가 회원에게 제공하는 서비스의 종류는 다음과 같습니다.</p>
            <ul className="inner_list">
              <li>
                금융 거래장소(Platform) 서비스
                <br />
                회사가 연계대출계약 및 연계투자계약이 체결되도록 하는 모든
                활동에 대하여 온라인으로 제공하는 서비스 및 관련 부가서비스
                일체를 말합니다.
              </li>
              <li>
                기타 서비스
                <br />
                회사의 금융 거래장소(Platform) 서비스 이외에 온라인을 통하여
                제공하는 홍보서비스 등 기타의 서비스를 말합니다. 회사는 서비스
                변경 시 그 변경되는 서비스의 내용 및 제공일자를 제18조에서 정한
                방법에 따라 회원에게 통지하고 제공할 수 있습니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제5조 (이용계약의 성립 등)</div>
            <ul className="inner_list">
              <li>
                서비스 이용계약은 회원이 되고자 하는 이용자가 이 약관에 동의한
                후 회원가입을 신청하면 회사가 이를 승낙하여 회원가입 절차가
                완료됨으로써 성립합니다.
              </li>
              <li>
                회원가입을 신청하는 이용자는 회사가 요구하는 개인정보를 성실히
                제공하여야 합니다.
              </li>
              <li>
                회사는 다음에 해당하는 경우에는 승낙을 유보할 수 있습니다.
                <ul className="inner_list">
                  <li>기술상 서비스를 제공할 수 없는 경우</li>
                  <li>보안 문제가 있다고 판단되는 경우</li>
                  <li>기타 사유로 이용 승낙이 곤란한 경우</li>
                </ul>
              </li>
              <li>
                회사는 회원가입을 신청하는 이용자가 다음에 해당하는 경우 승낙을
                거절할 수 있습니다.
                <ul className="inner_list">
                  <li>
                    만 14세 미만인 경우. 단, 개인정보의 처리에 대한 법정대리인의
                    동의를 얻어 신청하는 경우에는 승낙할 수 있습니다.
                  </li>
                  <li>
                    신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는
                    경우
                  </li>
                  <li>
                    회사의 사전 허가 없이 회원자격을 타인에게 양도, 대여,
                    공유하는 경우
                  </li>
                  <li>기타 이용 신청자의 귀책사유로 승낙이 곤란한 경우</li>
                </ul>
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제6조 (회원가입)</div>
            <ul className="inner_list">
              <li>
                이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후, 이
                약관과 개인정보취급방침에 동의하고 회원가입 신청을 합니다.
              </li>
              <li>
                회사는 회원으로 가입할 것을 신청한 이용자 중에서 다음 각 호에
                해당하지 않는 한 회원으로 등록합니다.
                <ul className="inner_list">
                  <li>회사가 요구하는 정보를 정확히 제공하지 않은 경우</li>
                  <li>타인의 명의를 도용하여 신청한 경우</li>
                  <li>
                    기타 회원으로 등록하는 것이 회사의 기술상 현저히 곤란한 경우
                  </li>
                </ul>
              </li>
              <li>
                회원가입 계약의 성립 시기는 회사의 승낙이 회원에게 도달한
                시점으로 합니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제7조 (회원정보의 보호)</div>
            <ul className="inner_list">
              <li>
                회사는 회원정보의 보호를 위해 개인정보취급방침을 수립하여
                회원정보의 보호에 최선을 다하며, 이를 준수합니다.
              </li>
              <li>
                회사는 회원의 개인정보를 본인의 동의 없이 타인에게 제공하지
                않습니다. 다만, 다음의 경우는 예외로 합니다.
                <ul className="inner_list">
                  <li>회원이 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사기관에서 요구한 경우</li>
                  <li>타인의 생명, 신체, 재산 등을 보호하기 위한 경우</li>
                  <li>
                    기타 회사의 긴급한 경영상의 필요나 고객의 권익을 보호할
                    필요가 있는 경우
                  </li>
                </ul>
              </li>
              <li>
                회원은 언제든지 자신의 개인정보를 열람하거나 수정할 수 있으며,
                개인정보의 오류에 대한 정정을 요청할 수 있습니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제8조 (회사의 의무)</div>
            <p>
              회사는 회원이 안전하게 서비스를 이용할 수 있도록 합리적인 기술적,
              관리적, 물리적 보안을 유지합니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제9조 (회원의 의무)</div>
            <ul className="inner_list">
              <li>
                회원은 본인의 아이디(ID)와 비밀번호를 관리하여야 하며, 이를
                제3자에게 양도하거나 대여할 수 없습니다.
              </li>
              <li>
                회원은 회사의 서비스 이용과 관련하여 다음 각 호의 행위를 해서는
                안됩니다.
                <ul className="inner_list">
                  <li>법령 또는 이 약관을 위반하는 행위</li>
                  <li>타인의 저작권 등의 권리를 침해하는 행위</li>
                  <li>
                    서비스에 장애를 초래할 수 있는 컴퓨터 프로그램 등을
                    사용하거나 유포하는 행위
                  </li>
                  <li>
                    회사의 사전 동의 없이 영리목적으로 서비스를 사용하는 행위
                  </li>
                  <li>기타 불법적이거나 부당한 행위</li>
                </ul>
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">
              제10조 (서비스 이용권리의 양도 등)
            </div>
            <p>
              회원의 서비스 이용권리는 회원 개인에게 국한되며, 회사의 사전 서면
              동의가 없는 경우 양도, 증여, 임대할 수 없습니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제11조 (계약해지 및 이용제한)</div>
            <ul className="inner_list">
              <li>
                회원은 언제든지 회사에게 해지 의사를 통지하여 서비스 이용계약을
                해지할 수 있습니다.
              </li>
              <li>
                회사는 회원이 이 약관에 위반하는 행위를 한 경우 이용계약을
                해지하거나 일시적으로 이용을 정지할 수 있습니다.
              </li>
              <li>
                회사가 이용계약을 해지하거나 이용을 정지하는 경우 회원에게 이를
                통지합니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제12조 (서비스 변경 및 중지)</div>
            <p>
              회사는 운영상 또는 긴급한 기술적 사유로 인하여 서비스의 전부 또는
              일부를 변경하거나 중지할 수 있습니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">
              제13조 (전자메일 등에 대한 회원의 의무와 책임)
            </div>
            <p>
              회사는 회원이 제공한 전자메일 등의 주소로 발송되는 정보에 대한
              손해 또는 책임을 부담하지 않습니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제14조 (게시물 등의 관리)</div>
            <p>
              회사는 회원이 게시하거나 등록하는 내용물이 다음 각 호에 해당하는
              경우 사전 통지 없이 삭제할 수 있습니다.
            </p>
            <ul className="inner_list">
              <li>법령 또는 이 약관을 위반하는 내용을 포함하는 경우</li>
              <li>회사가 사전 동의 없이 부적합하다고 판단하는 경우</li>
              <li>기타 회사의 운영정책에 위반되는 경우</li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제15조 (링크)</div>
            <p>
              회사는 회사의 동의 없이 다른 인터넷 사이트와의 링크(하이퍼링크)를
              설정할 수 없습니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제16조 (면책)</div>
            <p>
              회사는 회사의 귀책사유 없이 발생한 회원의 손해에 대하여는 책임을
              부담하지 않습니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제17조 (분쟁해결)</div>
            <p>
              회사와 회원 간의 분쟁에 관한 소송은 회사의 소재지를 관할하는
              법원에 제소합니다.
            </p>
          </li>

          <li className="section">
            <div className="section-title">제18조 (약관의 효력 및 변경)</div>
            <ul className="inner_list">
              <li>
                이 약관은 회사가 서비스를 제공하는 기간 동안 효력을 가집니다.
              </li>
              <li>
                회사는 필요한 경우 관련 법령이나 사정의 변경 등을 사전 고지 후
                이 약관을 변경할 수 있습니다.
              </li>
            </ul>
          </li>

          <li className="section">
            <div className="section-title">제19조 (기타사항)</div>
            <p>
              본 약관에 명시되지 않은 사항이나 이해의 해석에 관하여는 관계 법령
              및 상관례에 따릅니다.
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
            margin-bottom: 30px;
          }
          .title_sub {
            font-size: 14px;
            margin-top: 20px;
          }
          .outer_list {
            li {
              font-size: 14px;
              line-height: 20px;
            }
            > li {
              //list-style-type: decimal; /* 숫자 */
              font-weight: bold;
              .inner_list {
                padding-left: 15px;
              }
              .inner_list li {
                list-style-type: disc; /* 원형 점 */
                font-weight: normal;
                margin-bottom: 10px;
              }
            }
          }

          .section {
            margin-top: 30px;
            p {
              font-weight: 400;
              margin-bottom: 10px;
            }
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

export default TermsGeneral;
