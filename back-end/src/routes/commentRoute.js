const express = require("express");
const {
  addComment,
  getComments,
  getComment,
  editComment,
  removeComment,
} = require("../controllers/commentController");

const router = express.Router();

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Add a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             required:
 *               - content
 *               - postId
 *               - userId
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       500:
 *         description: Server error
 */
router.post("/comment", addComment);

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *       500:
 *         description: Server error
 */
router.get("/comments/:postId", getComments);

/**
 * @swagger
 * /api/comment/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Successfully retrieved comment
 *       500:
 *         description: Server error
 */
router.get("/comment/:id", getComment);

/**
 * @swagger
 * /api/comment/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Successfully updated comment
 *       500:
 *         description: Server error
 */
router.put("/comment/:id", editComment);

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/comment/:id", removeComment);

module.exports = router;
