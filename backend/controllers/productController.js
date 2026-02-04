const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const product = Product({
      ...req.body,
      createdBy: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    let searchKeyword = req.query.keyword || "";
    if (searchKeyword.endsWith("s")) {
      searchKeyword = searchKeyword.slice(0, -1);
    }
    const keyword = searchKeyword
      ? {
          name: {
            $regex: searchKeyword,
            $options: "i",
          },
        }
      : {};

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const priceFilter = {
      price: {
        $gte: Number(req.query.minPrice) || 0,
        $lte: Number(req.query.maxPrice) || 100000,
      },
    };
    const sortOption =
      req.query.sort === "price"
        ? { price: 1 }
        : req.query.sort === "-price"
          ? { price: -1 }
          : { createdAt: -1 };
    const filter = {
      ...keyword,
      ...categoryFilter,
      ...priceFilter,
    };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .populate("category", "name")
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    // .populate("createdBy", "name email");
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
    "name",
  );

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
};
