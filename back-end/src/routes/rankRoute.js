const express = require("express");
const { getTopViewedPosts } = require("../controllers/rankController");

const router = express.Router();

/**
 * @swagger
 * /api/rank/top-views:
 *   get:
 *     summary: Get top 10 posts by view count
 *     tags: [Ranking]
 *     responses:
 *       200:
 *         description: Successfully retrieved top posts
 *       500:
 *         description: Server error
 */
router.get("/top-views", getTopViewedPosts);

module.exports = router;
