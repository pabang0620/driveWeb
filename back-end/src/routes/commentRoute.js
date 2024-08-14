const express = require("express");
const {
  addComment,
  editComment,
  removeComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addComment);

router.put("/:id", authMiddleware, editComment);

router.delete("/:id", authMiddleware, removeComment);

module.exports = router;
