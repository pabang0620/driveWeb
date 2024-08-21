import TitleBox from "../../components/TitleBox";

const StatisticsManagement = () => {
  return (
    <div className="statisticsManagement_container">
      <TitleBox title="관리자페이지" subtitle="통계관리" />
      <div className="description">
        <p>
          구글 애널리틱스를 통해
          <br className="mbr" />
          웹사이트의 방문자 데이터를 분석하고,
          <br className="mbr" />
          <br className="pbr" />
          사용자 행동을 이해하여
          <br className="mbr" />
          비즈니스 인사이트를 확보할 수 있습니다.
        </p>
        <p>
          아래 버튼을 클릭하여
          <br className="mbr" />
          애널리틱스 대시보드로 이동하세요.
        </p>
      </div>
      <div className="button-wrapper">
        <button
          className="navyBox"
          onClick={() =>
            window.open(
              "https://analytics.google.com/analytics/web/#/p452556071/reports/intelligenthome",
              "_blank" // 새 창으로 열기
            )
          }
        >
          바로 확인하기
        </button>
      </div>
      <style jsx>{`
        .statisticsManagement_container {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0 200px 0;
          @media (max-width: 768px) {
            height: calc(100vh - 350px);
          }
          .pbr {
            display: block;
            @media (max-width: 768px) {
              display: none;
            }
          }
          .mbr {
            display: none;
            @media (max-width: 768px) {
              display: block;
            }
          }
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
          div.description {
            width: 100%;
            text-align: center;
            margin: 15% 0 8% 0;
            font-size: 16px;
            p {
              margin-bottom: 11px;
            }
            @media (max-width: 768px) {
              font-size: 14px;
            }
          }
          button.navyBox {
            display: block;
            width: 40%;
            margin: 0 auto;
            padding: 12px;
            background-color: #3c5997;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            font-weight: bold;
            @media (max-width: 768px) {
              font-size: 14px;
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
};
export default StatisticsManagement;
