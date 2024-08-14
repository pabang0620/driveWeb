const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// multer 설정
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
}).single("image"); // 한 번에 하나의 파일을 업로드할 수 있도록 설정

const handleFileUpload = (req, res, next) => {
  console.log("Starting file upload...");
  upload(req, res, function (err) {
    if (err) {
      console.error("Error during file upload:", err);
      return res
        .status(500)
        .json({ error: "파일 업로드 중 오류가 발생했습니다." });
    }
    console.log("File uploaded successfully.");
    next();
  });
};

module.exports = handleFileUpload;
