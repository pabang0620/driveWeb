const express = require("express");
const {
  addComment,
  editComment,
  removeComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/", addComment);

router.put("/:id", editComment);

router.delete("/:id", removeComment);

module.exports = router;
