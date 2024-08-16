// routes/adminRoutes.js
const express = require("express");
const {
  fetchUsersByPage,
  updateUser,
} = require("../controllers/adminController");

const router = express.Router();

// 특정 사용자 조회

// 모든 사용자 조회
router.get("/users", fetchUsersByPage);

router.put("/users/:id", updateUser);

module.exports = router;
