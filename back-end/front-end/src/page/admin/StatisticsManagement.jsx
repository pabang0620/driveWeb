import TitleBox from "../../components/TitleBox";
import useAdminCheckPermission from "../../utils/useAdminCheckPermission";
import "./admin.scss";

const StatisticsManagement = () => {
  useAdminCheckPermission();
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
    </div>
  );
};
export default StatisticsManagement;
