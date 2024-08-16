const { getUsersByPage, updateUserById } = require("../models/adminModel");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 유저 정보를 페이지 단위로 가져오는 컨트롤러
const fetchUsersByPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await getUsersByPage(page, limit);
    const totalUsers = await prisma.users.count(); // 전체 유저 수 계산

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users by page:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 유저 정보 수정 컨트롤러
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const userData = req.body;

  try {
    const updatedUser = await updateUserById(userId, userData);
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  fetchUsersByPage,
  updateUser,
};
