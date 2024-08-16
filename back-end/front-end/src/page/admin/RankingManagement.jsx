import { useState } from "react";
import CategorySetting from "./CategorySetting";
import TitleBox from "../../components/TitleBox";

const RankingManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "랭킹", visible: true },
    { id: 2, name: "운행시간", visible: true },
    { id: 3, name: "총 운송수입급", visible: true },
  ]);

  return (
    <div className="ranking-management">
      <TitleBox title="관리자페이지" subtitle="랭킹관리" />
      <CategorySetting categories={categories} setCategories={setCategories} />
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
