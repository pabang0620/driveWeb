// controllers/swaggerSpec.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API 문서",
      version: "1.0.0",
      description: "API 설명",
    },
    servers: [
      {
        url: "http://krdriver.com", // 배포된 서버의 URL
      },
    ],
  },
  apis: ["./routes/*.js"], // 주석이 작성된 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
