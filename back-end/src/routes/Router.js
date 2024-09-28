// routes/mainRoute.js
const express = require("express");
const router = express.Router();

const userRoute = require("./userRoute");
const postRoute = require("./postRoute");
const homeRoute = require("./homeRoute");
const commentRoute = require("./commentRoute");
const rankRoute = require("./rankRoute");
const driveRoute = require("./driveRoute");
const mypageRoute = require("./mypageRoute");
const mycarRoute = require("./mycarRoute");
const maintenanceRoute = require("./maintenanceRoute");
const summaryRoute = require("./summaryRoute");
const taxRoute = require("./taxRoute");
const adminRoute = require("./adminRoute");
const socialRoute = require("./socialRoute");
const excelRoute = require("./excelRoute");
const paymentRoute = require("./paymentRoute");

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/comment", commentRoute);
router.use("/home", homeRoute);
router.use("/rank", rankRoute);
router.use("/drive", driveRoute);
router.use("/mypage", mypageRoute);
router.use("/mycar", mycarRoute);
router.use("/maintenance", maintenanceRoute);
router.use("/summary", summaryRoute);
router.use("/tax", taxRoute);
router.use("/admin", adminRoute);
router.use("/social", socialRoute);
router.use("/excel", excelRoute);
router.use("/payments", paymentRoute);

module.exports = router;
