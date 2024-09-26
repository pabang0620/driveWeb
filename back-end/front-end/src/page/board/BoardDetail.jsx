import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TitleBox from "../../components/TitleBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import Spinner from "../../components/Spinner";
import { faUserCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import { getUserId } from "../../components/ApiGet";
import axios from "axios";
import useCheckPermission from "../../utils/useCheckPermission";
import { jwtDecode } from "jwt-decode";

import "./board.scss";

const BoardDetail = () => {
  // useCheckPermission();

  const location = useLocation();
  const { boardId = 2 } = location.state || {}; // 전달된 state가 없는

  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [postOptionModalOpen, setPostOptionModalOpen] = useState(false);
  const [commentOptionModalOpen, setCommentOptionModalOpen] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userPermission, setUserPermission] = useState(null); // 유저 권한 상태 추가

  // // 대댓글
  // const [replyOptionModalOpen, setReplyOptionModalOpen] = useState({});
  // const [replyContent, setReplyContent] = useState({});

  const togglePostOptionModal = () => {
    setPostOptionModalOpen(!postOptionModalOpen);
  };

  const toggleCommentOptionModal = (commentId) => {
    setCommentOptionModalOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // 대댓글
  // const toggleReplyOptionModal = (replyId) => {
  //   setReplyOptionModalOpen((prev) => ({
  //     ...prev,
  //     [replyId]: !prev[replyId],
  //   }));
  // };

  useEffect(() => {
    const loadPost = async () => {
      try {
        // 토큰 가져오기
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token); // 토큰 디코딩
          setUserPermission(decodedToken.permission); // 유저 권한 설정
        }
        const response = await axios.get(`/api/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const postData = response.data;
        // 댓글에 replies 속성이 없는 경우 빈 배열로 초기화
        const commentsWithReplies = postData.comments.map((comment) => ({
          ...comment,
          replies: comment.replies || [],
        }));
        setPost({ ...postData, comments: commentsWithReplies });
        setIsLiked(postData.isLiked);
      } catch (err) {
        setError(err.message);
      }
    };

    loadPost();
  }, [postId]);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/post/${postId}/like`,
        {
          liked: !isLiked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiked(!isLiked);
      setPost({ ...post, likeCount: response.data.likeCount });
    } catch (err) {
      alert("로그인 해주세요");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    setIsCommenting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/comment`,
        {
          content: newComment,
          postId: Number(postId),
          userId: currentUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const comment = response.data;
      setPost({
        ...post,
        comments: [...post.comments, comment],
      });
      setNewComment("");
      window.location.reload();
    } catch (err) {
      alert("로그인 해주세요");
    } finally {
      setIsCommenting(false);
    }
  };

  const handlePostDelete = async () => {
    if (userPermission !== 1 && userPermission !== 2 && userPermission !== 3) {
      if (currentUserId !== post.users.id) {
        alert("삭제 권한이 없습니다.");
        return;
      }
    }

    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate(`/board/list/${boardId}`);
    } catch (err) {
      console.error("게시글 삭제 중 오류가 발생했습니다:", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    const comment = post.comments.find((comment) => comment.id === commentId);

    if (userPermission !== 1 && userPermission !== 2 && userPermission !== 3) {
      if (currentUserId !== comment.userId) {
        alert("삭제 권한이 없습니다.");
        return;
      }
    }

    const confirmed = window.confirm("덧글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPost({
        ...post,
        comments: post.comments.filter((comment) => comment.id !== commentId),
      });
    } catch (err) {
      console.error("덧글 삭제 중 오류가 발생했습니다:", err);
    }
  };

  // 대댓글 작성
  // const handleReplySubmit = async (commentId) => {
  //   if (replyContent[commentId]?.trim() === "") return;

  //   try {
  //     const newReply = await createReply(
  //       replyContent[commentId],
  //       post.id,
  //       commentId
  //     ); // userId를 1로 가정
  //     setPost({
  //       ...post,
  //       comments: post.comments.map((comment) => {
  //         if (comment.id === commentId) {
  //           return {
  //             ...comment,
  //             replies: [...(comment.replies || []), newReply],
  //           };
  //         }
  //         return comment;
  //       }),
  //     });
  //     setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
  //   } catch (err) {
  //     console.error("대댓글 작성 중 오류가 발생했습니다:", err);
  //   }
  // };

  // const handleReplyChange = (commentId, content) => {
  //   setReplyContent((prev) => ({
  //     ...prev,
  //     [commentId]: content,
  //   }));
  // };

  // const handleReplyDelete = async (replyId, commentId) => {
  //   const confirmed = window.confirm("대댓글을 삭제하시겠습니까?");
  //   if (!confirmed) {
  //     return;
  //   }

  //   try {
  //     await deleteReply(replyId);
  //     setPost({
  //       ...post,
  //       comments: post.comments.map((comment) => {
  //         if (comment.id === commentId) {
  //           return {
  //             ...comment,
  //             replies: comment.replies.filter((reply) => reply.id !== replyId),
  //           };
  //         }
  //         return comment;
  //       }),
  //     });
  //   } catch (err) {
  //     console.error("대댓글 삭제 중 오류가 발생했습니다:", err);
  //   }
  // };
  // 마운트시 현재 유저아이디 가져오기
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = getUserId();
        setCurrentUserId(userId);
      } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류가 발생했습니다:", err);
      }
    };

    fetchCurrentUserId();
  }, []);

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
    const userId = getUserId();

    if (userId === post.userId) {
      navigate(`/board/post/edit/${postId}`, { state: { boardId } });
    } else {
      alert("수정 권한이 없습니다.");
    }
  };

  return (
    <div className="boardDetail">
      <div className="boardPostHeader">
        <TitleBox title="게시판" />
        <div>
          <button className="writeButton" onClick={() => navigate("/board")}>
            목록
          </button>
          <button className="writeButton" onClick={handleWriteButtonClick}>
            글쓰기
          </button>
        </div>
      </div>
      <section>
        <h2>{post.title}</h2>
        <div className="detailHeaderSet">
          <div className="detailUser DetailTopFlex">
            <div className="dlatl">
              {post.user.imageUrl ? (
                <img src={post.user.imageUrl} alt="프로필 이미지" />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  color="#c1c1c1"
                  size="3x"
                />
              )}
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
                  {comment.user.imageUrl ? (
                    <img
                      src={comment.user.imageUrl}
                      alt="댓글 작성자 프로필 이미지"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      color="#c1c1c1"
                      size="3x"
                    />
                  )}{" "}
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
                      {/* <div className="postDelectButton adited">수정</div> */}
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

              {/* {comment.replies && comment.replies.length > 0 && (
                <div className="replySection">
                  {comment.replies.map((reply) => (
                    <div className="replySetting" key={reply.id}>
                      <div className="detailUser">
                        <div className="dlatldlatl">
                          <img src="" alt="" />
                        </div>
                        <div className="detailUserdetail">
                          <p className="detailName">
                            {reply.users
                              ? reply.users.nickname
                              : reply.user.nickname}
                          </p>
                          <p className="commentDetail">{reply.content}</p>
                          <div className="detailUserLast">
                            <p>{new Date(reply.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="burgerRelate">
                          <FontAwesomeIcon
                            icon={faEllipsisV}
                            onClick={() => toggleReplyOptionModal(reply.id)}
                            style={{ padding: "3px", cursor: "pointer" }}
                          />
                          {replyOptionModalOpen[reply.id] && (
                            <div className="postControllButtonBox">
                              <div className="postDelectButton adited">
                                수정
                              </div>
                              <div
                                className="postDelectButton"
                                onClick={() =>
                                  handleReplyDelete(reply.id, comment.id)
                                }
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
              )} */}
              {/* <div className="replyInput">
                <input
                  type="text"
                  value={replyContent[comment.id] || ""}
                  onChange={(e) =>
                    handleReplyChange(comment.id, e.target.value)
                  }
                  placeholder="대댓글을 입력하세요..."
                />
                <button onClick={() => handleReplySubmit(comment.id)}>
                  작성
                </button>
              </div> */}
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
    </div>
  );
};

export default BoardDetail;
