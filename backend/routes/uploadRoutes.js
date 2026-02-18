const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File not uploaded" });
  }

  res.json({
    message: "File Recieved",
    fileName: req.file.originalname,
  });
});

module.exports = router;
