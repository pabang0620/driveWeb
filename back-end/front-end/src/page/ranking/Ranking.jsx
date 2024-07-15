const Ranking = () => {
  return (
    <div className="container ranking-container">
      <h2>랭킹</h2>
      <div className="rankingInner">
        <div className="ranking">
          <h3>연비</h3>
          <ul className="profileWrap">
            <li className="profile">
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
            <li>
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
            <li>
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
            <li>
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
          </ul>
        </div>
        <div className="ranking">
          <h3>연비</h3>
          <ul className="profileWrap">
            <li className="profile">
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
            <li>
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
          </ul>
        </div>
        <div className="ranking">
          <h3>연비</h3>
          <ul className="profileWrap">
            <li className="profile">
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
            <li>
              <div className="profilePicture"></div>
              <p className="profileName"></p>
              <p>dd</p>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .ranking-container {
          padding: 30px 0;
          margin: 0 auto;
          .rankingInner {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .ranking {
              width: 30%;
              ul.profileWrap {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 5%;
                gap: 10px;
                background-color: #f0f3f5;
                border-radius: 5px;
                li {
                  background-color: white;
                  border: 1px solid #d9d9d9;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                  border-radius: 5px;
                  padding: 10px;
                  .profilePicture {
                    width: 40px;
                    height: 40px;
                    background-color: gold;
                    border-radius: 50%;
                  }
                }
              }
            }
          }
        }
      `}</style>
    </div>
  );
};
export default Ranking;
