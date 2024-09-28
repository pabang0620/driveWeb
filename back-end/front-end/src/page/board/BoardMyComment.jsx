import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 수정: jwtDecode 가져오기 방식 변경
import Spinner from "../../components/Spinner";
import TitleBox from "../../components/TitleBox";

const BoardMyComment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // JWT 토큰에서 userId 추출
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    }
    return null;
  };

  // 사용자가 작성한 댓글 가져오기 (Axios 사용)
  const fetchUserComments = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error("유효한 사용자 토큰이 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/comment/user/${userId}`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트되면 댓글을 불러옴
  useEffect(() => {
    fetchUserComments();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  const handlePostClick = (postId) => {
    navigate(`/board/post/${postId}`);
  };

  return (
    <div className="boardComment">
      <div className="boardCommentHeader">
        <TitleBox title="게시판" subtitle="작성한 덧글" />
      </div>

      <div
        className="tableWrapper"
        style={{ height: "500px", overflowY: "auto" }}
      >
        <table className="commentTable">
          <thead>
            <tr>
              <th>댓글 내용</th>
              <th>게시글 제목</th>
              <th>작성시간</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan="4">작성한 댓글이 없습니다.</td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <tr
                  key={comment.id}
                  onClick={() => handlePostClick(comment.posts.id)}
                >
                  <td>{comment.content}</td>
                  <td>{comment.posts?.title || "제목 없음"}</td>
                  <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardMyComment;
