const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createComment = async (content, postId, userId) => {
  return await prisma.comment.create({
    data: {
      content,
      post: { connect: { id: postId } },
      user: { connect: { id: userId } },
    },
  });
};

const getCommentsByPost = async (postId) => {
  return await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
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
