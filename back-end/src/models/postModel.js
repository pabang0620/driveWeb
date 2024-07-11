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
// 게시물 작성
const createPostModel = async ({
  title,
  content,
  boardId,
  userId,
  imageUrl,
}) => {
  console.log("Data received for creating post:", {
    title,
    content,
    boardId,
    userId,
    imageUrl,
  });
  try {
    return await prisma.posts.create({
      data: {
        title,
        content,
        boardId,
        userId,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

const createPostImages = async (postId, imageUrls) => {
  try {
    await prisma.postImages.createMany({
      data: imageUrls.map((url) => ({ postId, imageUrl: url })),
    });
  } catch (error) {
    console.error("Error creating post images:", error);
    throw error;
  }
};

// 게시판 별로 게시글 제목 10개씩
const getBoardById = async (boardId) => {
  try {
    const board = await prisma.boards.findUnique({
      where: { id: boardId },
      select: {
        name: true,
      },
    });
    return board;
  } catch (err) {
    console.error(`Error fetching board with id ${boardId}:`, err);
    throw err;
  }
};

const getPostsByPage = async (boardId, page, search) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
      }
    : {};

  try {
    const posts = await prisma.posts.findMany({
      where: {
        boardId,
        ...searchCondition,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        createdAt: true,
        users: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    const totalPosts = await prisma.posts.count({
      where: {
        boardId,
        ...searchCondition,
      },
    });

    return { posts, totalPosts };
  } catch (err) {
    console.error(`Error fetching posts for board ${boardId}:`, err);
    throw err;
  }
};
// 게시물조회
const getPostById = async (id, userId) => {
  const post = await prisma.posts.findUnique({
    where: { id },
    include: {
      comments: {
        include: {
          users: true, // 댓글 작성자의 정보를 포함
        },
      },
      postImages: true,
      users: true,
    },
  });

  if (!post) return null;

  const userLike = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: id,
      },
    },
  });

  return { ...post, isLiked: !!userLike };
};

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

const toggleLike = async (postId, userId, liked) => {
  if (liked) {
    await prisma.likes.create({
      data: {
        userId,
        postId,
      },
    });
    await prisma.posts.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.likes.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    await prisma.posts.update({
      where: { id: postId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });
  }

  const updatedPost = await prisma.posts.findUnique({
    where: { id: postId },
  });

  return updatedPost;
};

const updatePost = async (id, title, content) => {
  return await prisma.posts.update({
    where: { id },
    data: { title, content },
  });
};

const deletePost = async (id) => {
  // 좋아요 먼저 삭제
  await prisma.likes.deleteMany({
    where: { postId: id },
  });

  // 댓글 먼저 삭제
  await prisma.comments.deleteMany({
    where: { postId: id },
  });

  // 이미지 삭제
  await prisma.postImages.deleteMany({
    where: { postId: id },
  });

  // 게시글 삭제
  return await prisma.posts.delete({
    where: { id },
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

// 보드별로 10위까지 가져오기 getBoards getLatestPostsByBoard getAllLatestPosts
const getBoards = async () => {
  try {
    const boards = await prisma.boards.findMany();
    return boards;
  } catch (err) {
    console.error("Error fetching boards:", err);
    throw err;
  }
};

const getLatestPostsByBoard = async (boardId) => {
  try {
    const posts = await prisma.posts.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        viewCount: true,
        likeCount: true,
        userId: true,
        boardId: true,
        users: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return posts;
  } catch (err) {
    console.error(`Error fetching posts for board ${boardId}:`, err);
    throw err;
  }
};

const getAllLatestPosts = async () => {
  try {
    const boards = await getBoards();
    console.log("Boards:", boards);

    const postsByBoard = await Promise.all(
      boards.map(async (board) => {
        try {
          const posts = await getLatestPostsByBoard(board.id);
          console.log(`Posts for board ${board.id}:`, posts);
          return { boardId: board.id, boardName: board.name, posts };
        } catch (err) {
          console.error(`Error fetching posts for board ${board.id}:`, err);
          return { boardId: board.id, boardName: board.name, posts: [] };
        }
      })
    );

    return postsByBoard;
  } catch (err) {
    console.error("Error fetching boards or posts:", err);
    throw new Error("Failed to fetch boards or posts");
  }
};

module.exports = {
  createBoard,
  deleteBoard,
  createPostModel,
  createPostImages,
  getBoardById,
  getPostsByPage,
  getPostById,
  updatePost,
  getTopPostsByLikesAndViews,
  deletePost,
  incrementViewCount,
  toggleLike,
  getAllLatestPosts,
};
