import { useParams } from "react-router-dom";
import TitleBox from "../../components/TitleBox";

const BoardDetail = () => {
  const { postId } = useParams(); // URL에서 postId 파라미터 추출

  // 더미 데이터
  const dummyPost = {
    id: 1,
    title: "운행일지 개발일지",
    content:
      "더미 포스트 내용입니다. 여기에는 실제 게시글 내용이 들어갈 수 있습니다.",
    date: "2024-07-10",
  };

  return (
    <div className="boardDetail">
      <TitleBox title="게시판" subtitle="게시글" />
      <div className="boardPostHeader">
        <button className="writeButton">목록</button>
        <button className="writeButton">글쓰기</button>
      </div>
      <section>
        <h2>{dummyPost.title}</h2>
        <div className="detailHeaderSet">
          <div className="detailUser DetailTopFlex">
            <div className="dlatl">
              <img src="" alt="" />
            </div>
            <div className="detailUserdetail detailUserdetailAdd">
              <p className="detailName">이름</p>
              <div className="detailUserLast">
                <p>2024.11.11</p>
                <p>조회수 </p>
              </div>
            </div>
          </div>
          <div>햄버거</div>
        </div>
        <div className="detailBodyDetail">sodyd sodyd </div>
        <div className="detailFooterStart">
          <div>좋아요</div>
          <div>덧글</div>
        </div>

        <div className="detailFooterSet">
          <div className="commentSetting">
            <div className="detailUser">
              <div className="dlatldlatl">
                <img src="" alt="" />
              </div>
              <div className="detailUserdetail">
                <p className="detailName">이원호</p>
                <p className="commentDetail">
                  국회에 제출된 법률안 기타의 의안은 회기중에 의결되지 못한
                  이유로 폐기되지 아니한다. 다만, 국회의원의 임기가 만료된
                  때에는 그러하지 아니하다. 국방상 또는 국민경제상 긴절한 필요로
                  인하여 법률이 정하는 경우를 제외하고는, 사영기업을 국유 또는
                  공유로 이전하거나 그 경영을 통제 또는 관리할 수 없다.
                </p>
                <div className="detailUserLast">
                  <p>2024.11.11</p>
                </div>
              </div>
              <div>햄버거</div>
            </div>
          </div>
        </div>
        <div className="commentInputSet">
          <textarea
            className="commentInput"
            type="text"
            placeholder="덧글을 입력해주세요"
          />
          <button className="commentPost">작성</button>
        </div>
      </section>
      <style jsx>{`
        .boardDetail {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0 200px;
          .commentInputSet {
            padding: 40px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .commentPost {
            width: 60px;
            margin-left: 10px;
            border-radius: 3px;
            background-color: black;
            color: white;
          }
          .commentInput {
            width: 95%;
            border-radius: 3px;
            height: 59px;
            border: 1px solid #d9d9d9;
            padding: 10px 0 0 10px;
            font-size: 14px;
            outline: none;
            resize: none; /* 사용자 크기 조정 비활성화 */
          }
          .detailFooterSet {
            padding: 80px 20px 20px;
          }
          .commentSetting {
            padding-bottom: 20px;
            border-bottom: 1px solid #d9d9d9;
          }
          .detailUser {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .detailUserdetail {
            display: flex;
            flex-direction: column;
            width: 90%;
          }
          .detailUserdetailAdd {
            width: 40%;
          }
          .detailName {
            font-size: 14px;
            margin: 0 7px;
          }
          .commentDetail {
            font-size: 13px;
            margin: 0 7px;
          }
          .detailUserLast {
            display: flex;
            flex-direction: row;
            p {
              margin: 5px 7px;
              color: #999;
              font-size: 11px;
            }
          }
          .dlatldlatl {
            background-color: black;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .dlatl {
            background-color: black;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 10px;
          }
          section {
            border: 1px solid #999;
            border-radius: 10px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            h2 {
              font-size: 32px;
              font-weight: 400;
              margin: 8px 0px 24px;
            }
            .detailHeaderSet {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              padding-bottom: 20px;
              border-bottom: 1px solid #d9d9d9;
            }
            .detailBodyDetail {
              min-height: 500px;
              padding: 20px;
            }
            .detailFooterStart {
              display: flex;
              flex-direction: row;
              div {
                margin: 0px 5px;
              }
            }
            .DetailTopFlex {
              width: 100%;
            }
          }
          .boardPostHeader {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 10px 0px 10px 20px;
          }
          .writeButton {
            padding: 8px 16px;
            background-color: #05aced;
            color: #fff;
            border: none;
            border-radius: 5px;
            margin: 0 0 0 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            outline: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BoardDetail;
