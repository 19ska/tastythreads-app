const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (file) => {
  const extension = file.originalname.split(".").pop();
  const fileName = `threads/${uuidv4()}.${extension}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
