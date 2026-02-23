const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductsBySlug,
  createProductReview,
} = require("../controllers/productController");
const { protect, adminProtect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protect, adminProtect, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:slug", getProductsBySlug);
router.post("/:id/reviews", protect, createProductReview);
module.exports = router;
