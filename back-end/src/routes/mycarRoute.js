const express = require("express");
const {
  getCarInfo,
  updateCarInfo,
  uploadCarImage,
  getUserMaintenanceItems,
} = require("../controllers/mycarController");
const authMiddleware = require("../middleware/authMiddleware");
const handleFileUpload = require("../middleware/postFileUpload");
const router = express.Router();

router.get("/", authMiddleware, getCarInfo);
router.put("/", authMiddleware, updateCarInfo);
router.put("/image", authMiddleware, handleFileUpload, uploadCarImage);
router.get("/maintenanceItems/:userId", getUserMaintenanceItems);
module.exports = router;
