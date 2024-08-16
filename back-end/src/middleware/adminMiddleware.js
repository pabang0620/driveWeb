const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  const userIdFromRequest =
    req.body.userId || req.query.userId || req.header("userId");

  if (userIdFromRequest) {
    req.userId = userIdFromRequest;
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "인증 토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

module.exports = adminMiddleware;
