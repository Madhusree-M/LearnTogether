const express = require("express");
const router = express.Router();
const { getPresignedUrl } = require("../controllers/uploadController");

// Route to get a pre-signed URL for frontend direct upload
router.post("/presigned-url", getPresignedUrl);

module.exports = router;
