const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminProtect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, adminProtect, getAllOrders);
router.put("/:id/status", protect, adminProtect, updateOrderStatus);

module.exports = router;
