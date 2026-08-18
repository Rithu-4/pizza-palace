const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// =====================================================
// RAZORPAY INSTANCE
// =====================================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// TEST PAYMENT CONFIGURATION
// =====================================================

router.get("/config", (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `pizza_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order.id);

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "Razorpay create order error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error.message ||
        "Unable to create Razorpay order",
    });
  }
});

// =====================================================
// VERIFY PAYMENT
// =====================================================

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log(
      "Payment verified:",
      razorpay_payment_id
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

module.exports = router;