const {
  getUsersByPage,
  updateUserById,
  updateBoardModel,
  createBoardModel,
  getAllBoardsModel,
  deleteBoardModel,
  getPostsModel,
} = require("../models/adminModel");
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

// 게시판 종류 관련
// 모든 게시판 목록 가져오기
const getAllBoards = async (req, res) => {
  try {
    const boards = await getAllBoardsModel();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Failed to get boards", error });
  }
};

// 게시판 생성
const createBoard = async (req, res) => {
  const { name, displayed } = req.body;
  try {
    const board = await createBoardModel({
      name,
      displayed,
    });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to create the board", error });
  }
};

// 특정 게시판 이름 및 표시 여부 수정
const updateBoard = async (req, res) => {
  const { id } = req.params;
  const { name, displayed } = req.body;
  try {
    const board = await updateBoardModel(id, { name, displayed });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to update the board", error });
  }
};

// 게시판 삭제
const deleteBoard = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteBoardModel(id);
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the board", error });
  }
};

// 게시글 정보
const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // page 파라미터로 페이지 번호 받기
  const itemsPerPage = parseInt(req.query.limit) || 10; // limit 파라미터로 페이지당 항목 수 받기

  try {
    // 전체 게시글 수를 가져와서 페이지네이션에 사용
    const totalPosts = await prisma.posts.count();

    // 게시글 가져오기
    const posts = await getPostsModel(page, itemsPerPage);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalPosts / itemsPerPage);

    res.json({
      posts, // 게시글 데이터
      totalPosts, // 전체 게시글 수
      totalPages, // 전체 페이지 수
      currentPage: page, // 현재 페이지
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

const deletePosts = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "유효한 ID 목록이 제공되지 않았습니다." });
  }

  try {
    await prisma.posts.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    res.status(200).json({ message: "게시물들이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "게시물 삭제에 실패했습니다.", error });
  }
};
module.exports = {
  fetchUsersByPage,
  updateUser,
  // 게시판 관련
  getAllBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  getPosts,
  deletePosts,
};
