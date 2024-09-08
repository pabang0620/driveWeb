const express = require("express");
const {
  addBoard,
  removeBoard,
  addPost,
  getPosts,
  getPost,
  editPost,
  removePost,
  likePost,
  unlikePost,
  getTopPosts,
  fetchAllLatestPosts,
  createPost,
  getBoards,
} = require("../controllers/postController");
const handleFileUpload = require("../middleware/postFileUpload");
const authMiddleware = require("../middleware/authMiddleware");
const { getBoardsName } = require("../models/postModel");
const postMiddleware = require("../middleware/postMiddleware");

const router = express.Router();

// 게시물 작성 /api/post
router.post("/", authMiddleware, createPost);
// router.post("/", authMiddleware , authMiddleware, createPostController);

// 홈 최근 게시글
router.get("/latest", fetchAllLatestPosts);
// 해당 보드의 게시글 모두 조회 100개씩
router.get("/board/:boardId", getPosts);

router.get("/boardsName", getBoards);

router.get("/:id", postMiddleware, getPost);

router.get("/:boardId/top", getTopPosts); // 인기순위 가져오는 API

router.post("/:id/like", authMiddleware, likePost);

router.put("/:id", authMiddleware, editPost);

router.delete("/:id", authMiddleware, removePost);

module.exports = router;
