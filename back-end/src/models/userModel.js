const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (
  nickname,
  email,
  password,
  googleId = null,
  kakaoId = null,
  naverId = null
) => {
  return await prisma.user.create({
    data: {
      nickname,
      email,
      password, // 일반 로그인 용
      googleId,
      kakaoId,
      naverId,
    },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const findUserByGoogleId = async (googleId) => {
  return await prisma.user.findUnique({
    where: { googleId },
  });
};

const findUserByKakaoId = async (kakaoId) => {
  return await prisma.user.findUnique({
    where: { kakaoId },
  });
};

const findUserByNaverId = async (naverId) => {
  return await prisma.user.findUnique({
    where: { naverId },
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserByKakaoId,
  findUserByNaverId,
};
