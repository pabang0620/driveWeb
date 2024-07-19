const express = require("express");
const path = require("path");
const cors = require("cors");
const Router = require("./routes/Router");
const { swaggerUi, swaggerSpec } = require("./controllers/swaggerSpec");

require("dotenv").config();

const app = express();

// 요청 본문의 크기 제한을 500KB로 설정하고, 크기 초과 에러 처리를 추가
app.use(express.json({ limit: "50mb" }));

app.use(cors());

// Static files (JavaScript, images, etc.)
app.use(express.static(path.join(__dirname, "../front-end/build")));

// Specific route for your API
app.use("/api", Router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route for serving React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../front-end/build/index.html"));
});

module.exports = app;
