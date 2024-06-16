const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBoard = async (name) => {
  return await prisma.board.create({
    data: { name },
  });
};

const deleteBoard = async (id) => {
  return await prisma.board.delete({
    where: { id },
  });
};

const createPost = async (title, content, boardId, userId) => {
  return await prisma.post.create({
    data: {
      title,
      content,
      board: { connect: { id: boardId } },
      user: { connect: { id: userId } },
    },
  });
};

const getPostsByBoard = async (boardId) => {
  return await prisma.post.findMany({
    where: { boardId },
    include: { user: true },
  });
};

const getPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id },
    include: { user: true, board: true },
  });
};

const updatePost = async (id, title, content) => {
  return await prisma.post.update({
    where: { id },
    data: { title, content },
  });
};

const deletePost = async (id) => {
  return await prisma.post.delete({
    where: { id },
  });
};

// 조회수
const incrementViewCount = async (id) => {
  return await prisma.post.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
};
// 추천수
const incrementLikeCount = async (id) => {
  return await prisma.post.update({
    where: { id },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });
};

const decrementLikeCount = async (id) => {
  return await prisma.post.update({
    where: { id },
    data: {
      likeCount: {
        decrement: 1,
      },
    },
  });
};

const getTopPostsByViews = async () => {
  return await prisma.post.findMany({
    orderBy: {
      viewCount: "desc",
    },
    take: 10,
    include: {
      user: true,
      board: true,
    },
  });
};

module.exports = {
  createBoard,
  deleteBoard,
  createPost,
  getPostsByBoard,
  getPostById,
  updatePost,
  deletePost,
  incrementViewCount,
  incrementLikeCount,
  decrementLikeCount,
  getTopPostsByViews,
};
