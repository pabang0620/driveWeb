import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>국민대부 주식회사</h2>
        <ul className="help_area">
          <li>
            <span>전화</span>010-3194-3603
          </li>
        </ul>
        <ul className="company_area">
          <li>대표자 김재청</li>
          <li>사업자 등록번호 298-88-01870</li>
          <li>서울특별시 양천구 화곡로12길 23-22 202호</li>
        </ul>
        <p className="copyline">&copy; 상호 국민대부 주식회사</p>
      </div>

      <style jsx>{`
        .footer {
          height: 220px;
          background-color: rgb(222, 226, 229);
          padding: 20px;
          color: #5c667b;
          display: flex;
          flex-direction: column;
          gap: 30px 0;
          ul,
          li,
          ol {
            list-style: none;
          }
          @media (max-width: 1024px) {
            height: 220px;
            padding: 5% 8%;
          }
          @media (max-width: 767px) {
            height: 300px;
            padding: 10% 8%;
          }
          > div {
            width: 80%;
            margin: 0 auto;
            max-width: 1200px;
            @media (max-width: 1024px) {
              width: 100%;
            }
            h2 {
              font-weight: 600;
              font-size: 16px;
              margin: 30px 0 10px 0;
              @media (max-width: 1024px) {
                font-weight: 600;
                font-size: 22px;
                margin: 0 0 15px 0;
              }
            }
            ul.help_area,
            ul.company_area {
              display: flex;
              justify-content: flex-start;
              gap: 0 10px;
              @media (max-width: 767px) {
                flex-direction: column;
                gap: 7px;
                margin-top: 7px;
              }
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
            @media (max-width: 1024px) {
              padding: 15px 0 5px 0;
            }
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
