const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const product = newProduct({
      ...req.body,
      createdBy: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json({ message: "product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
