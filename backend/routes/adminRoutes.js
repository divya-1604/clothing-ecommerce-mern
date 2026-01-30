const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { adminProtect } = require("../middlewares/adminMiddleware");

router.get("/test", protect, adminProtect, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

module.exports = router;
