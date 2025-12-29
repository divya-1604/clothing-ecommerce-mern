const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});
module.exports = router;
