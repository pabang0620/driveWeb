import axios from "axios";

// 게시글 가져오기
export const fetchPost = async (postId) => {
  const response = await axios.get(`/api/post/${postId}`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axios.delete(`/api/post/${postId}`);
  return response.data;
};

// 좋아요 처리
export const likePost = async (postId, isLiked) => {
  const response = await axios.post(`/api/post/${postId}/like`, {
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
  const response = await axios.post(`/api/comment`, {
    content,
    postId,
    userId,
    parentId,
  });
  return response.data;
};

// 덧글 삭제
export const deleteComment = async (commentId) => {
  const response = await axios.delete(`/api/comment/${commentId}`);
  return response.data;
};
