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
const getUserCommentsById = async (userId) => {
  try {
    const comments = await prisma.comments.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: { createdAt: "desc" }, // 최신 댓글부터 정렬
      select: {
        id: true,
        content: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true, // 댓글이 달린 게시글의 제목
          },
        },
      },
    });
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for user ${userId}:`, error);
    throw error; // 에러를 호출한 쪽으로 전달
  }
};
module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getUserCommentsById,
};
