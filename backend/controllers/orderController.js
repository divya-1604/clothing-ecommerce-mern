const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order Items" });
    }
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.countInStock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      product.countInStock -= item.quantity;
      await product.save();
    }
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "order not found" });

  order.orderStatus = req.body.status || order.orderStatus;

  if (order.orderStatus === "Delivered") {
    order.isPaid = true;
    order.paidAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};
