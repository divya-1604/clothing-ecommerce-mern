const mongoose = require("mongoose");
const slugify = require("slugify");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Kids"],
    },
    brand: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    images: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
// productSchema.pre("save", function (next) {
//     if (this.isModified("name")) {
//       this.slug = this.name
//         .toLowerCase()
//         .replace(/ /g, "-")
//         .replace(/[^\w-]+/g, "");
//     }
//     next();
//   });

productSchema.pre("validate", function () {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
});
module.exports = mongoose.model("Product", productSchema);
