import RankingList from "./RankingList";

const Ranking = () => {
  return (
    <div className="container ranking-container">
      <h2>랭킹</h2>
      <div className="rankingInner">
        <RankingList
          title={"연비"}
          rankType={"fuelType"}
          options={[
            "전체",
            "LPG",
            "전기",
            "휘발유",
            "경유",
            "하이브리드",
            "천연가스",
            "수소",
            "바이오디젤",
            "에탄올",
            "기타",
          ]}
        />

        <RankingList
          title={"운행시간"}
          rankType={"jobType"}
          options={["전체직종", "택시", "배달", "기타"]}
        />
        <RankingList
          title={"총 운송수입금"}
          rankType={"carType"}
          options={["전체"]}
        />
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
