const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductsBySlug,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", getAllProducts);
router.get("/:slug", getProductsBySlug);

module.exports = router;
