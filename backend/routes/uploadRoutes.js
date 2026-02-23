const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const cloudinary = require("../utils/cloudinary");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "clothing-ecommerce" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
