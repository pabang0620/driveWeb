// routes/mainRoute.js
const express = require("express");
const router = express.Router();

const userRoute = require("./userRoute");
const postRoute = require("./postRoute");
const homeRoute = require("./homeRoute");
const commentRoute = require("./commentRoute");
const rankRoute = require("./rankRoute");
const driveRoute = require("./driveRoute");

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/comment", commentRoute);
router.use("/home", homeRoute);
router.use("/rank", rankRoute);
router.use("/drive", driveRoute);

module.exports = router;
