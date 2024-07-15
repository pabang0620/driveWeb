const express = require("express");
const {
  getItems,
  addItem,
  addRecord,
  updateItem,
  updateRecord,
} = require("../controllers/maintenanceController");

const router = express.Router();

router.get("/items", getItems);
router.post("/items", addItem);
router.post("/records", addRecord);
router.put("/items", updateItem);
router.put("/records", updateRecord);

module.exports = router;
