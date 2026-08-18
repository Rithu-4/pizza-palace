const express = require("express");

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/ordercontroller");

const router = express.Router();

// CREATE ORDER
router.post("/", createOrder);

// GET ALL ORDERS
router.get("/", getAllOrders);

// GET USER ORDERS
router.get("/:userId", getUserOrders);

// UPDATE ORDER STATUS
router.put("/:id", updateOrderStatus);

// DELETE ORDER
router.delete("/:id", deleteOrder);

module.exports = router;