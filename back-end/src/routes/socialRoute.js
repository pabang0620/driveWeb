const express = require("express");

const {
  googleLogin,
  kakaoLogin,
  naverLogin,
} = require("../controllers/socialController");

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/kakao-login", kakaoLogin);
router.post("/naver-login", naverLogin);

module.exports = router;
