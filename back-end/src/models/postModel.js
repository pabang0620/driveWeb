const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBoard = async (name) => {
  return await prisma.boards.create({
    data: { name },
  });
};

const deleteBoard = async (id) => {
  return await prisma.boards.delete({
    where: { id },
  });
};

const createPost = async (title, content, boardId, userId) => {
  return await prisma.posts.create({
    data: {
      title,
      content,
      board: { connect: { id: boardId } },
      user: { connect: { id: userId } },
    },
  });
};

const getPostsByBoard = async (boardId) => {
  return await prisma.posts.findMany({
    where: { boardId },
    include: { user: true },
  });
};

const getPostById = async (id) => {
  return await prisma.posts.findUnique({
    where: { id },
    include: { user: true, board: true },
  });
};

const updatePost = async (id, title, content) => {
  return await prisma.posts.update({
    where: { id },
    data: { title, content },
  });
};

const deletePost = async (id) => {
  return await prisma.posts.delete({
    where: { id },
  });
};

// 조회수
const incrementViewCount = async (id) => {
  return await prisma.posts.update({
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
  return await prisma.posts.update({
    where: { id },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });
};

const decrementLikeCount = async (id) => {
  return await prisma.posts.update({
    where: { id },
    data: {
      likeCount: {
        decrement: 1,
      },
    },
  });
};

// 게시글
const getTopPostsByLikesAndViews = async (boardId) => {
  const topLikedPosts = await prisma.posts.findMany({
    where: { boardId },
    orderBy: { likeCount: "desc" },
    take: 10,
    select: {
      id: true,
      viewCount: true,
      title: true,
      likeCount: true,
      _count: {
        select: { comments: true },
      },
    },
  });

  const topViewedPosts = await prisma.posts.findMany({
    where: { boardId },
    orderBy: { viewCount: "desc" },
    take: 10,
    select: {
      id: true,
      viewCount: true,
      title: true,
      likeCount: true,
      _count: {
        select: { comments: true },
      },
    },
  });

  return { topLikedPosts, topViewedPosts };
};

module.exports = {
  createBoard,
  deleteBoard,
  createPost,
  getPostsByBoard,
  getPostById,
  updatePost,
  getTopPostsByLikesAndViews,
  deletePost,
  incrementViewCount,
  incrementLikeCount,
  decrementLikeCount,
};
