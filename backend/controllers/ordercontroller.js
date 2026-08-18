const Order = require("../models/order");

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  console.log("=================================");
  console.log("CREATE ORDER");
  console.log("BODY RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("=================================");

  try {
    const {
      userId,
      customer,
      location,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      paymentStatus,
    } = req.body;

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer details are required",
      });
    }

    if (!customer.name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone is required",
      });
    }

    if (!customer.address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    if (!customer.city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!customer.pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (total === undefined || total === null) {
      return res.status(400).json({
        success: false,
        message: "Order total is required",
      });
    }

    // ---------------------------------------------
    // CREATE ORDER
    // ---------------------------------------------

    const order = await Order.create({
      userId,

      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
      },

      location: location || null,

      items,

      subtotal: Number(subtotal || 0),

      deliveryFee: Number(deliveryFee || 0),

      discount: Number(discount || 0),

      total: Number(total),

      paymentMethod: paymentMethod || "razorpay",

      paymentStatus: paymentStatus || "Pending",

      status: "Pending",
    });

    console.log("ORDER CREATED:", order._id);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET USER ORDERS
// =====================================================

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Getting orders for user:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    console.log(`Found ${orders.length} orders`);

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL ORDERS
// =====================================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE ORDER
// =====================================================

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};