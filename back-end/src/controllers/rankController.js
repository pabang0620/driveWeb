const { getTopPostsByViews } = require("../models/postModel");

const getTopViewedPosts = async (req, res) => {
  try {
    const topPosts = await getTopPostsByViews();
    res.status(200).json(topPosts);
  } catch (error) {
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
};

module.exports = {
  getTopViewedPosts,
};
