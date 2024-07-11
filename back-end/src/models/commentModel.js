const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createComment = async (content, postId, userId, parentId = null) => {
  const comment = await prisma.comments.create({
    data: {
      content,
      postId,
      userId,
      parentId,
    },
  });

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { nickname: true },
  });

  return {
    ...comment,
    user: {
      nickname: user.nickname,
    },
  };
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

const updateComment = async (id, content) => {
  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
};

const deleteComment = async (id) => {
  return await prisma.comments.delete({
    where: { id },
  });
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
