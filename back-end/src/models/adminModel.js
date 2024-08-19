const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 페이지 단위로 유저 정보를 가져오는 모델 함수
const getUsersByPage = async (page, limit) => {
  const offset = (page - 1) * limit;

  try {
    const users = await prisma.users.findMany({
      skip: offset,
      take: limit,
      include: {
        user_profiles: {
          select: {
            phone: true,
            birth_date: true,
            name: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    throw new Error("Database error while fetching users");
  }
};

// 유저 정보 수정 모델 함수
const updateUserById = async (userId, userData) => {
  try {
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username: userData.username,
        nickname: userData.nickname,
        status: userData.status,
        permission: parseInt(userData.permission),
        jobtype: parseInt(userData.jobtype, 10), // jobtype을 Int로 변환
        user_profiles: {
          update: {
            name: userData.user_profiles?.name,
            phone: userData.user_profiles?.phone,
            birth_date: userData.user_profiles?.birth_date,
          },
        },
      },
      include: {
        user_profiles: true, // 프로필 데이터를 포함하여 반환
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user in the database:", error);
    throw new Error("Database update error");
  }
};

// 게시판 종류 관련
const getAllBoardsModel = async () => {
  return await prisma.boards.findMany();
};

const createBoardModel = async (data) => {
  return await prisma.boards.create({
    data,
  });
};

const updateBoardModel = async (id, data) => {
  return await prisma.boards.update({
    where: { id: parseInt(id) },
    data,
  });
};

// 게시판 삭제
const deleteBoardModel = async (id) => {
  return await prisma.boards.delete({
    where: { id: parseInt(id) },
  });
};

const getPostsModel = async (page, itemsPerPage, filters) => {
  const { author, title, startDate, endDate } = filters;
  const skip = (page - 1) * itemsPerPage;
  const take = itemsPerPage;

  // 필터 조건을 동적으로 추가
  const where = {
    ...(author && { users: { nickname: { contains: author } } }),
    ...(title && { title: { contains: title } }),
    ...(startDate &&
      endDate && {
        createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
      }),
  };

  // 게시물 조회 (최신순 정렬)
  const posts = await prisma.posts.findMany({
    skip,
    take,
    where: Object.keys(where).length > 0 ? where : undefined, // 필터가 없으면 전체 조회
    orderBy: {
      createdAt: "desc", // 최신순 정렬
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      boards: {
        select: {
          name: true,
        },
      },
      users: {
        select: {
          nickname: true,
        },
      },
    },
  });

  // 전체 게시물 수 조회
  const totalPosts = await prisma.posts.count({
    where: Object.keys(where).length > 0 ? where : undefined, // 필터가 없으면 전체 조회
  });

  return { posts, totalPosts };
};

module.exports = {
  getUsersByPage,
  updateUserById,
  // 게시판 종류 관련
  getAllBoardsModel,
  createBoardModel,
  updateBoardModel,
  deleteBoardModel,
  getPostsModel,
};
