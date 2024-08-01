import RankingList from "./RankingList";

const Ranking = () => {
  return (
    <div className="container ranking-container">
      <h2>랭킹</h2>
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
          .rankingInner {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Ranking;
