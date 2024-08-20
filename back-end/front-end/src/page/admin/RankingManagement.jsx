import { useState } from "react";
import TitleBox from "../../components/TitleBox";
import RankCategorySetting from "./RankCategorySetting";

const RankingManagement = () => {
  return (
    <div className="ranking-management">
      <TitleBox title="관리자페이지" subtitle="랭킹관리" />
      <RankCategorySetting />
      <style jsx>{`
        .ranking-management {
          width: 75%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
        }
      `}</style>
    </div>
  );
};
export default RankingManagement;
