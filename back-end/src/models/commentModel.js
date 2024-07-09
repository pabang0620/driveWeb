const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createComment = async (content, postId, userId, parentId = null) => {
  return await prisma.comments.create({
    data: {
      content,
      postId,
      userId,
      parentId, // parentId 추가
    },
  });
};

const getCommentsByPost = async (postId) => {
  return await prisma.comments.findMany({
    where: { postId },
    include: {
      user: true,
      replies: { include: { user: true } }, // 대댓글 포함
    },
  });
};

const getCommentById = async (id) => {
  return await prisma.comment.findUnique({
    where: { id },
    include: { user: true, post: true },
  });
};

const updateComment = async (id, content) => {
  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
};

const deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id },
  });
};

module.exports = {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
