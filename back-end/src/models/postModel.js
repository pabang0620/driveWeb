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
  // console.log("Data received for creating post:", {
  //   title,
  //   content,
  //   boardId,
  //   userId,
  //   imageUrl,
  // });
  try {
    const createdPost = await prisma.posts.create({
      data: {
        title,
        content,
        boardId,
        userId,
        imageUrl,
      },
    });

    // 생성된 게시물의 ID를 반환
    return createdPost.id;
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
const getPostsByUser = async (userId, page, search) => {
  const limit = 10; // 페이지당 게시글 수
  const offset = (page - 1) * limit; // 페이지 오프셋 계산

  // 검색 조건 설정
  const searchCondition = search
    ? {
        OR: [
          { title: { contains: search } }, // 제목에서 검색
          { content: { contains: search } }, // 내용에서 검색
        ],
      }
    : {}; // 검색어가 없으면 조건 없음

  try {
    // 특정 유저가 작성한 게시글 가져오기
    const posts = await prisma.posts.findMany({
      where: {
        userId: userId, // userId로 필터링
        ...searchCondition, // 검색 조건 추가
      },
      orderBy: { createdAt: "desc" }, // 최신 순으로 정렬
      skip: offset, // 페이지 오프셋 적용
      take: limit, // 가져올 게시글 수 적용
      select: {
        id: true,
        title: true,
        createdAt: true,
        users: {
          select: { nickname: true }, // 작성자 닉네임
        },
        _count: {
          select: { comments: true }, // 댓글 수 카운트
        },
      },
    });

    // 해당 유저의 게시글 총 개수
    const totalPosts = await prisma.posts.count({
      where: {
        userId: userId, // userId로 필터링
        ...searchCondition, // 검색 조건 추가
      },
    });

    return { posts, totalPosts };
  } catch (err) {
    console.error(`Error fetching posts for user ${userId}:`, err);
    throw err;
  }
};

// 게시물조회
const getPostById = async (id, userId) => {
  const post = await prisma.posts.findUnique({
    where: { id },
    include: {
      comments: {
        select: {
          id: true,
          postId: true,
          content: true,
          userId: true,
          createdAt: true,
          users: {
            select: {
              id: true,
              nickname: true,
              user_profiles: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
      postImages: true,
      users: {
        select: {
          id: true,
          nickname: true,
          user_profiles: {
            select: {
              imageUrl: true,
            },
          },
        },
      },
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

  return {
    ...post,
    isLiked: !!userLike,
    user: {
      id: post.users.id,
      nickname: post.users.nickname,
      imageUrl: post.users.user_profiles.imageUrl,
    },
    comments: post.comments.map((comment) => ({
      id: comment.id,
      postId: comment.postId,
      content: comment.content,
      userId: comment.userId,
      createdAt: comment.createdAt,
      user: {
        id: comment.users.id,
        nickname: comment.users.nickname,
        imageUrl: comment.users.user_profiles.imageUrl,
      },
    })),
  };
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
  try {
    const existingLike = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // 좋아요가 이미 존재하면 삭제
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
    } else {
      // 좋아요가 존재하지 않으면 추가
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
    }

    const updatedPost = await prisma.posts.findUnique({
      where: { id: postId },
    });

    return updatedPost;
  } catch (error) {
    console.error("좋아요 토글 중 오류 발생:", error);
    throw error;
  }
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

// 10개 최신 id 값에 따라 게시판별
const getTopPostsByLikesAndViews = async () => {
  try {
    const topViewedPosts = await prisma.posts.findMany({
      where: { boardId: { not: 1 } },
      orderBy: { viewCount: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
        viewCount: true,
        boards: {
          // 관계 참조
          select: {
            name: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    const topLikedPosts = await prisma.posts.findMany({
      where: { boardId: { not: 1 } },
      orderBy: { likeCount: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
        likeCount: true,
        boards: {
          // 관계 참조
          select: {
            name: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return {
      topViewedPosts,
      topLikedPosts,
    };
  } catch (error) {
    console.error("Error fetching top posts by likes and views:", error);
    throw error;
  }
};

const getTopPostsByBoards = async () => {
  try {
    const boardIds = [1, 2, 3]; // 공지사항, 자유게시판, 사진게시판의 boardId
    const boardsWithPosts = await Promise.all(
      boardIds.map(async (boardId) => {
        const board = await prisma.boards.findUnique({
          where: { id: boardId },
          select: {
            id: true,
            name: true,
            posts: {
              orderBy: { createdAt: "desc" },
              take: 10,
              select: {
                id: true,
                title: true,
                createdAt: true,
                _count: {
                  select: { comments: true },
                },
              },
            },
          },
        });
        return board;
      })
    );

    return boardsWithPosts;
  } catch (error) {
    console.error("Error fetching top posts by boards:", error);
    throw error;
  }
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

const getBoardsName = async () => {
  return await prisma.boards.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
module.exports = {
  createBoard,
  deleteBoard,
  createPostModel,
  createPostImages,
  getBoardById,
  getPostsByPage,
  getPostsByUser,
  getPostById,
  updatePost,
  // 홈에서 쓰는 랭킹
  getTopPostsByLikesAndViews,
  getTopPostsByBoards,
  // -----
  deletePost,
  incrementViewCount,
  toggleLike,
  getAllLatestPosts,
  getBoardsName,
};
