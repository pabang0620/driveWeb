// routes/mainRoute.js
const express = require("express");
const router = express.Router();

const userRoute = require("./userRoute");
const postRoute = require("./postRoute");
const homeRoute = require("./homeRoute");

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/home", homeRoute);

module.exports = router;
