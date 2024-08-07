import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TitleBox from "../../components/TitleBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import Spinner from "../../components/Spinner";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  fetchPost,
  likePost,
  createComment,
  deletePost,
  deleteComment,
} from "../../utils/post/postapis";

const BoardDetail = () => {
  const boardId = 2;
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [postOptionModalOpen, setPostOptionModalOpen] = useState(false);
  const [commentOptionModalOpen, setCommentOptionModalOpen] = useState({});

  const togglePostOptionModal = () => {
    setPostOptionModalOpen(!postOptionModalOpen);
  };

  const toggleCommentOptionModal = (commentId) => {
    setCommentOptionModalOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPost(postId);
        setPost(postData);
        setIsLiked(postData.isLiked);
      } catch (err) {
        setError(err.message);
      }
    };

    loadPost();
  }, [postId]);

  const handleLikeClick = async () => {
    try {
      const data = await likePost(postId, isLiked);
      setIsLiked(!isLiked);
      setPost({ ...post, likeCount: data.likeCount });
    } catch (err) {
      console.error("좋아요 처리 중 오류가 발생했습니다:", err);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    setIsCommenting(true);
    try {
      const comment = await createComment(newComment, Number(postId), 1); // 사용자의 ID를 지정해야 합니다.
      setPost({
        ...post,
        comments: [...post.comments, comment],
      });
      setNewComment("");
    } catch (err) {
      console.error("덧글 작성 중 오류가 발생했습니다:", err);
    } finally {
      setIsCommenting(false);
    }
  };

  const handlePostDelete = async () => {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }
    try {
      await deletePost(postId);
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate(`/board/list/${boardId}`);
    } catch (err) {
      console.error("게시글 삭제 중 오류가 발생했습니다:", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm("덧글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteComment(commentId);
      setPost({
        ...post,
        comments: post.comments.filter((comment) => comment.id !== commentId),
      });
    } catch (err) {
      console.error("덧글 삭제 중 오류가 발생했습니다:", err);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <Spinner />;
  }

  const handleWriteButtonClick = () => {
    navigate("/board/post/add", { state: { boardId } });
  };

  const handleEdit = () => {
    navigate(`/board/post/edit/${postId}`, { state: { boardId } });
  };

  return (
    <div className="boardDetail">
      <TitleBox title="게시판" subtitle="게시글" />
      <div className="boardPostHeader">
        <button className="writeButton">목록</button>
        <button className="writeButton" onClick={handleWriteButtonClick}>
          글쓰기
        </button>
      </div>
      <section>
        <h2>{post.title}</h2>
        <div className="detailHeaderSet">
          <div className="detailUser DetailTopFlex">
            <div className="dlatl">
              <img src="" alt="" />
            </div>
            <div className="detailUserdetail detailUserdetailAdd">
              <p className="detailName"> {post.users.nickname}</p>

              <div className="detailUserLast">
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                <p>조회수 {post.viewCount}</p>
              </div>
            </div>
          </div>
          <div className="burgerRelate">
            <FontAwesomeIcon
              icon={faEllipsisV}
              onClick={togglePostOptionModal}
              style={{ padding: "3px", cursor: "pointer" }}
            />
            {postOptionModalOpen && (
              <div className="postControllButtonBox">
                <div className="postDelectButton adited" onClick={handleEdit}>
                  수정
                </div>
                <div className="postDelectButton" onClick={handlePostDelete}>
                  삭제
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="detailBodyDetail"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <div className="detailFooterStart">
          <div
            onClick={handleLikeClick}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon icon={isLiked ? solidHeart : regularHeart} />
            <span style={{ marginLeft: "5px" }}>좋아요 {post.likeCount}</span>
          </div>
          <div>덧글 {post.comments.length}</div>
        </div>

        <div className="detailFooterSet">
          {post.comments.map((comment) => (
            <div className="commentSetting" key={comment.id}>
              <div className="detailUser">
                <div className="dlatldlatl">
                  <img src="" alt="" />
                </div>
                <div className="detailUserdetail">
                  <p className="detailName">
                    {comment.users
                      ? comment.users.nickname
                      : comment.user.nickname}
                  </p>
                  <p className="commentDetail">{comment.content}</p>
                  <div className="detailUserLast">
                    <p>{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="burgerRelate">
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    onClick={() => toggleCommentOptionModal(comment.id)}
                    style={{ padding: "3px", cursor: "pointer" }}
                  />
                  {commentOptionModalOpen[comment.id] && (
                    <div className="postControllButtonBox">
                      <div className="postDelectButton adited">수정</div>
                      <div
                        className="postDelectButton"
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        삭제
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="commentInputSet">
          <textarea
            className="commentInput"
            type="text"
            placeholder="덧글을 입력해주세요"
            value={newComment}
            onChange={handleCommentChange}
            disabled={isCommenting}
          />
          <button
            className="commentPost"
            onClick={handleCommentSubmit}
            disabled={isCommenting}
          >
            작성
          </button>
        </div>
      </section>
      <style jsx>{`
        .boardDetail {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0 200px;
          .burgerRelate {
            position: relative;
            .postControllButtonBox {
              position: absolute;
              right: 4px;
              border: 1px solid #d9d9d9;
              font-size: 14px;
              width: 116px;
              border-radius: 3px;
              background-color: #ffffff;
            }
            .adited {
              border-bottom: 1px solid #d9d9d9;
            }
            .postDelectButton {
              height: 35px;
              line-height: 35px;
              padding: 0 10px;
              cursor: pointer;
            }
          }
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
            padding: 15px 0px;
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
              padding-bottom: 30px;
              border-bottom: 1px solid #d9d9d9;
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
