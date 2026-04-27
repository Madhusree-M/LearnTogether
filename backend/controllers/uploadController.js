const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3Client = require("../config/s3");
require("dotenv").config();

const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: "fileName and fileType are required" });
    }

    // Create a unique file name to avoid overwriting
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
    
    const bucketName = process.env.R2_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // Generate the signed URL for PUT request (valid for 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // The public URL where the file will be accessible after upload
    // using R2_PUBLIC_DOMAIN from .env
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    const fileUrl = `${publicDomain}/${uniqueFileName}`;

    res.status(200).json({
      uploadUrl: signedUrl,
      fileUrl: fileUrl,
      key: uniqueFileName
    });
    
  } catch (error) {
    console.error("Presigned URL Error:", error);
    res.status(500).json({ message: "Failed to generate pre-signed URL", error: error.message });
  }
};

module.exports = { getPresignedUrl };
