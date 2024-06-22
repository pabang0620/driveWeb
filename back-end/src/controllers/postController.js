const {
  createBoard,
  deleteBoard,
  createPost,
  getPostsByBoard,
  getPostById,
  updatePost,
  deletePost,
  incrementViewCount,
} = require("../models/postModel");

const addBoard = async (req, res) => {
  const { name } = req.body;
  try {
    const board = await createBoard(name);
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: "게시판 생성 중 오류가 발생했습니다." });
  }
};

const removeBoard = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteBoard(Number(id));
    res.status(200).json({ message: "게시판이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "게시판 삭제 중 오류가 발생했습니다." });
  }
};

const addPost = async (req, res) => {
  const { title, content, boardId, userId } = req.body;
  try {
    const post = await createPost(title, content, boardId, userId);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "게시글 생성 중 오류가 발생했습니다." });
  }
};

const getPosts = async (req, res) => {
  const { boardId } = req.params;
  try {
    const posts = await getPostsByBoard(Number(boardId));
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPostById(Number(id));
    await incrementViewCount(Number(id)); // 조회수 증가
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
};

// 추천 post
const likePost = async (req, res) => {
  const { id } = req.params;
  try {
    await incrementLikeCount(Number(id));
    res.status(200).json({ message: "게시글 추천이 증가했습니다." });
  } catch (error) {
    res.status(500).json({ error: "게시글 추천 중 오류가 발생했습니다." });
  }
};
// 추천 취소
const unlikePost = async (req, res) => {
  const { id } = req.params;
  try {
    await decrementLikeCount(Number(id));
    res.status(200).json({ message: "게시글 추천이 취소되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "게시글 추천 취소 중 오류가 발생했습니다." });
  }
};
const editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await updatePost(Number(id), title, content);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "게시글 수정 중 오류가 발생했습니다." });
  }
};

const removePost = async (req, res) => {
  const { id } = req.params;
  try {
    await deletePost(Number(id));
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "게시글 삭제 중 오류가 발생했습니다." });
  }
};
// 1위 ~ 10위 게시글
const getTopPosts = async (req, res) => {
  const { boardId } = req.params;
  try {
    const { topLikedPosts, topViewedPosts } = await getTopPostsByLikesAndViews(
      Number(boardId)
    );
    res.status(200).json({ topLikedPosts, topViewedPosts });
  } catch (error) {
    res.status(500).json({ error: "인기 게시글 조회 중 오류가 발생했습니다." });
  }
};
module.exports = {
  addBoard,
  removeBoard,
  addPost,
  getPosts,
  getPost,
  likePost,
  unlikePost,
  editPost,
  removePost,
  getTopPosts,
};
