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
} = require("../controllers/postController");

const router = express.Router();

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

/**
 * @swagger
 * /api/post/board/{boardId}:
 *   get:
 *     summary: 선택한 게시판의 게시글 모두 가져오기
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
 *       500:
 *         description: Server error
 */
router.get("/board/:boardId", getPosts);
/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: 게시물 작성
 *     tags: [Post]
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
 *               boardId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             required:
 *               - title
 *               - content
 *               - boardId
 *               - userId
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Server error
 */
router.post("/", addPost);

/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     summary: 선택한 게시글 가져오기
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
 *         description: Successfully retrieved post
 *       500:
 *         description: Server error
 */
router.get("/:id", getPost);

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
router.post("/:id/like", likePost);

/**
 * @swagger
 * /api/post/{id}/unlike:
 *   post:
 *     summary: 추천 취소
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
 *         description: Post unliked successfully
 *       500:
 *         description: Server error
 */
router.post("/:id/unlike", unlikePost);

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

module.exports = router;
