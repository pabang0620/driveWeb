const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../models/commentModel");

const addComment = async (req, res) => {
  const { content, postId, parentId } = req.body; // parentId 추가
  const { userId } = req;
  try {
    const comment = await createComment(content, postId, userId, parentId); // parentId 전달
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "덧글 생성 중 오류가 발생했습니다." });
  }
};

const getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await getCommentsByPost(Number(postId));
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "덧글 조회 중 오류가 발생했습니다." });
  }
};

const editComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await updateComment(Number(id), content);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "덧글 수정 중 오류가 발생했습니다." });
  }
};

const removeComment = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteComment(Number(id));
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류가 발생했습니다:", error);
    res.status(500).json({ error: "댓글 삭제 중 오류가 발생했습니다." });
  }
};

module.exports = {
  addComment,
  getComments,
  editComment,
  removeComment,
};
