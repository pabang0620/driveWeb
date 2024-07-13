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
} = require("../controllers/postController");
const handleFileUpload = require("../middleware/postFileUpload");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 게시물 작성 /api/post
router.post("/", createPost);
// router.post("/", authMiddleware, createPostController);

// 홈 최근 게시글
router.get("/latest", fetchAllLatestPosts);
// 해당 보드의 게시글 모두 조회 100개씩
router.get("/board/:boardId", getPosts);

router.get("/:id", getPost);

router.post("/:id/like", likePost);

router.put("/:id", editPost);

router.delete("/:id", removePost);

router.get("/:boardId/top", getTopPosts); // 인기순위 가져오는 API

// 관리자 모드
/**
 * @swagger
 * /api/post/board:
 *   post:
 *     summary: 게시판 종류 추가
 *     tags: [관리자 보드 관련]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Board created successfully
 *       500:
 *         description: Server error
 */
router.post("/board", addBoard);

/**
 * @swagger
 * /api/post/board/{id}:
 *   delete:
 *     summary: 게시판 종류 삭제
 *     tags: [관리자 보드 관련]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/board/:id", removeBoard);

module.exports = router;
