const express = require("express");
const router = express.Router();
const { protect, adminProtect } = require("../middlewares/authMiddleware");

router.get("/test", protect, adminProtect, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

module.exports = router;
