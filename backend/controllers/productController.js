const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const product = newProduct({
      ...req.body,
      createdBy: req.user._id,
    });
    const createdProduct = await product.save();
    res
      .status(201)
      .json({ message: "product created successfully", createdProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .populate("createdBy", "name email");
  res.json(products);
};

exports.getProductsBySlug = async (req, res) => {};
