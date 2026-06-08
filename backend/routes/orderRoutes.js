const express = require("express");

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/:userId", getUserOrders);

router.put("/:id", updateOrderStatus);

// DELETE ORDER
router.delete("/:id", deleteOrder);

module.exports = router;