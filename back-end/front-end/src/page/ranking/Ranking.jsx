import TitleBox from "../../components/TitleBox";
import RankingList from "./RankingList";

const Ranking = () => {
  return (
    <div className="container ranking-container">
      <TitleBox title="랭킹" />
      <div className="rankingInner">
        <RankingList title={"연비"} rankType={"fuelType"} />
        <RankingList title={"운행시간"} rankType={"jobType"} />
        <RankingList title={"총 운송수입금"} rankType={"carType"} />
      </div>
      <style jsx>{`
        .ranking-container {
          width: 70%;
          padding: 100px 0;
          margin: 0 auto;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }
          .rankingInner {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            @media (max-width: 1024px) {
              margin-top: 15px;
              gap: 10px;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Ranking;
