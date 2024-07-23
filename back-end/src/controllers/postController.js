const {
  createBoard,
  deleteBoard,
  createPostModel,
  getPostById,
  updatePost,
  deletePost,
  incrementViewCount,
  getAllLatestPosts,
  getPostsByPage,
  getBoardById,
  toggleLike,
  getBoardsName,
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
// 게시물 작성
const createPost = async (req, res) => {
  try {
    const { userId } = req;
    const { title, content, boardId } = req.body;
    const imageUrls = req.files ? req.files.map((file) => file.location) : []; // 업로드된 이미지의 URL들
    const post = await createPostModel({
      title,
      content,
      boardId: parseInt(boardId), // boardId를 정수형으로 변환
      userId: parseInt(userId), // userId를 정수형으로 변환
      imageUrl: imageUrls.length > 0 ? imageUrls[0] : null, // 첫 번째 이미지 URL을 저장
    });
    // 게시물 이미지 저장
    if (imageUrls.length > 0) {
      await createPostImages(post.id, imageUrls);
    }

    res.status(201).json({ post }); // 생성된 게시물의 ID를 반환
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 게시판 별로 게시글 제목 10개씩
const getPosts = async (req, res) => {
  const { boardId } = req.params;
  const { page = 1, search = "" } = req.query; // 검색어 추가

  try {
    const board = await getBoardById(Number(boardId));
    const { posts, totalPosts } = await getPostsByPage(
      Number(boardId),
      Number(page),
      search
    );
    res.status(200).json({ board, posts, totalPosts });
  } catch (error) {
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const post = await getPostById(Number(id), userId);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }
    await incrementViewCount(Number(id)); // 조회수 증가
    res.status(200).json(post);
  } catch (error) {
    console.error("게시글 조회 중 오류가 발생했습니다:", error);
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const { liked } = req.body;
  try {
    const post = await toggleLike(Number(id), userId, liked);
    res.status(200).json({ likeCount: post.likeCount });
  } catch (error) {
    console.error("좋아요 처리 중 오류가 발생했습니다:", error);
    res.status(500).json({ error: "좋아요 처리 중 오류가 발생했습니다." });
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
    console.error("게시글 삭제 중 오류가 발생했습니다:", error);
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

// 게시판 홈 최신 10개
const fetchAllLatestPosts = async (req, res) => {
  try {
    const postsByBoard = await getAllLatestPosts();
    res.status(200).json(postsByBoard);
  } catch (error) {
    res.status(500).json({ error: "최신 게시글 조회 중 오류가 발생했습니다." });
  }
};

// 보드 목록 (게시글작성)
const getBoards = async (req, res) => {
  try {
    const boards = await getBoardsName();
    res.status(200).json(boards);
  } catch (error) {
    res
      .status(500)
      .json({ error: "게시물 종류를 불러오는 중 오류가 발생했습니다." });
  }
};
module.exports = {
  addBoard,
  removeBoard,
  createPost,
  getPosts,
  getPost,
  likePost,
  editPost,
  removePost,
  getTopPosts,
  fetchAllLatestPosts,
  getBoards,
};
