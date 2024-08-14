const express = require("express");
const {
  addItem,
  addMaintenanceRecord,
  getItemsWithRecords,
  updateMaintenanceData,
  getRecordsWithItems,
} = require("../controllers/maintenanceController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/items", authMiddleware, getItemsWithRecords);
router.post("/items", authMiddleware, addItem);

router.post("/records", authMiddleware, addMaintenanceRecord);
router.put("/records/:id", authMiddleware, updateMaintenanceData);

router.get("/logAll", authMiddleware, getRecordsWithItems);

module.exports = router;
