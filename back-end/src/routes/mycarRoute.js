const express = require("express");
const {
  getCarInfo,
  updateCarInfo,
  uploadCarImage,
} = require("../controllers/mycarController");
const authMiddleware = require("../middleware/authMiddleware");
const handleFileUpload = require("../middleware/postFileUpload");
const router = express.Router();

router.get("/", authMiddleware, getCarInfo);
router.put("/", authMiddleware, updateCarInfo);
router.put("/image", authMiddleware, handleFileUpload, uploadCarImage);

module.exports = router;
