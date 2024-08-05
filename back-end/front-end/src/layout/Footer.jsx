import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>(주)운행일지</h2>
        <ul className="help_area">
          <li>
            <span>팩스</span>123-123-123
          </li>
          <li>
            <span>대표메일</span>kr.taxi.master@gmail.com
          </li>
        </ul>
        <ul className="company_area">
          <li>대표자 김재청</li>
          <li>사업자 등록번호 298-88-01870</li>
          <li>서울특별시 영등포구 가나다12길 ab플라자 0층</li>
        </ul>
        <p className="copyline">&copy; 상호 국민대부 주식회사</p>
      </div>

      <style jsx>{`
        .footer {
          height: 220px;
          background-color: rgb(222, 226, 229);
          padding: 20px;
          color: ##5c667b;
          display: flex;
          flex-direction: column;
          gap: 30px 0;
          > div {
            width: 80%;
            margin: 0 auto;
            max-width: 1200px;
            h2 {
              font-weight: 600;
              font-size: 16px;
              margin: 30px 0 10px 0;
            }
            ul.help_area,
            ul.company_area {
              display: flex;
              justify-content: flex-start;
              gap: 0 10px;
              li {
                font-size: 12px;
                line-height: 15px;
                margin-bottom: 6px;

                span {
                  font-weight: 500;
                  margin-right: 5px;
                }
              }
            }
          }
          .copyline {
            margin: 0;
            padding: 20px 0 10px 0;
            font-size: 11px;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
