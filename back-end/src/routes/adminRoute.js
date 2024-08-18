// routes/adminRoutes.js
const express = require("express");
const {
  fetchUsersByPage,
  updateUser,
  getAllBoards,
  updateBoard,
  createBoard,
  deleteBoard,
  getPosts,
  deletePosts,
} = require("../controllers/adminController");

const router = express.Router();

// 특정 사용자 조회

// 모든 사용자 조회
router.get("/users", fetchUsersByPage);

router.put("/users/:id", updateUser);

router.post("/boards", createBoard);

router.put("/boards/:id", updateBoard);

router.get("/boards", getAllBoards);

router.delete("/boards/:id", deleteBoard);

router.get("/posts", getPosts);

router.delete("/posts", deletePosts);

module.exports = router;
