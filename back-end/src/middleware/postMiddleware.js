const jwt = require("jsonwebtoken");

const postMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);

  if (!token) {
    // 토큰이 없으면 userId를 0으로 설정하고 다음 미들웨어로 이동
    req.userId = 0;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // 유효하지 않은 토큰이면 userId를 0으로 설정
    req.userId = 0;
    next();
  }
};

module.exports = postMiddleware;
