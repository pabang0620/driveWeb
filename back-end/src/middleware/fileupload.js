const { S3 } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');

// AWS credentials 및 S3 클라이언트 설정
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer-S3 설정
const fileupload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const decodedFileName = decodeURIComponent(file.originalname);
            cb(null, `${Date.now().toString()}-${decodedFileName}`);
        },
    }),
}).fields([
    { name: 'files[]', maxCount: 10 },
    { name: 'drawingBoardImage', maxCount: 5 }, // 여러 개의 그림판 이미지 업로드 허용
]);

// 파일의 S3 URL 가져오는 함수
const getFileUrl = (fileName) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                console.error('Error getting file URL from S3:', err);
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
};

module.exports = { fileupload, getFileUrl };
