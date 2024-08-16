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
        permission: userData.permission,
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

module.exports = {
  getUsersByPage,
  updateUserById,
};
