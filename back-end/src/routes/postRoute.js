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

// ====================================

/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Successfully updated post
 *       500:
 *         description: Server error
 */
router.put("/:id", editPost);

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/:id", removePost);

/**
 * @swagger
 * /api/post/{id}/like:
 *   post:
 *     summary: 게시물 추천
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/posts/{boardId}/top:
 *   get:
 *     summary: 각 게시판의 인기 게시글 조회
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Top posts retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/:boardId/top", getTopPosts); // 인기순위 가져오는 API

// 관리자 모드
/**
 * @swagger
 * /api/post/board:
 *   post:
 *     summary: 게시판 종류 추가
 *     tags: [Board]
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
 *     tags: [Board]
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
