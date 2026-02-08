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
    "name"
  );

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
};

exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.is);
    if (!product) return res.status(404).json({ message: "Product Not found" });
    const alreadyreviewd = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyreviewd)
      return res.status(400).json({ message: "Product already reviewed" });

    const reviews = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(reviews);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProductReview = async (req, res) => {
  try {
    //get the product and review id from the request parameters
    const { productId, reviewId } = req.params;
    //find the product by id
    const product = await Product.findById(productId);
    //if the product is not found return 404
    if (!product) return res.status(404).json({ message: "Product Not found" });
    //find the review index in the product reviews array
    const reviewIndex = product.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );
    //if the review is not found return 404
    if (reviewIndex === -1)
      return res.status(404).json({ message: "Review not found" });
    //check if the user is the review owner or an admin
    const review = product.reviews[reviewIndex];
    //if the user is not an admin and not the review owner return 403
    if (!req.user.isAdmin) {
      //check if the review user id matches the logged in user id
      if (review.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this review" });
      }
    }
    //remove the review from the product reviews array
    product.reviews.splice(reviewIndex, 1);
    //  update the product rating and number of reviews
    product.numReviews = product.reviews.length;
    // if there are no reviews left set the product rating to 0
    if (product.reviews.length === 0) {
      product.rating = 0;
    } else {
      // recalculate the average rating based on the remaining reviews
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    }

    await product.save();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
