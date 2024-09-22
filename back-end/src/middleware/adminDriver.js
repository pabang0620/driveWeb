const jwt = require("jsonwebtoken");

const adminDriver = (req, res, next) => {
  // 요청 body에서 userId를 찾습니다.
  const userIdFromBody = req.body.userId;

  console.log(userIdFromBody);
  if (userIdFromBody) {
    // userId가 body에 제공된 경우 이를 사용합니다.
    req.userId = Number(userIdFromBody);
    return next();
  }

  // userId가 body에 제공되지 않은 경우 토큰을 확인합니다.
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "인증 토큰이 없습니다." });
  }

  try {
    // 토큰에서 userId를 추출하여 설정합니다.
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

module.exports = adminDriver;
