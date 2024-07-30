import axios from "axios";

// 토큰 가져오기
const token = localStorage.getItem("token");

// axios 인스턴스 생성
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 게시글 가져오기
export const fetchPost = async (postId) => {
  console.log(token);
  const response = await axiosInstance.get(`/api/post/${postId}`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/api/post/${postId}`);
  return response.data;
};

// 좋아요 처리
export const likePost = async (postId, isLiked) => {
  const response = await axiosInstance.post(`/api/post/${postId}/like`, {
    liked: !isLiked,
  });
  return response.data;
};

// 덧글 작성
export const createComment = async (
  content,
  postId,
  userId,
  parentId = null
) => {
  const response = await axiosInstance.post(`/api/comment`, {
    content,
    postId,
    userId,
    parentId,
  });
  return response.data;
};

// 대댓글 작성
export const createReply = async (content, postId, userId, parentId) => {
  return createComment(content, postId, userId, parentId);
};

// 덧글 삭제
export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(`/api/comment/${commentId}`);
  return response.data;
};

// 대댓글 삭제
export const deleteReply = async (replyId) => {
  const response = await axiosInstance.delete(`/api/comment/${replyId}`);
  return response.data;
};
