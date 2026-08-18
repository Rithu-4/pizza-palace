const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

require("dotenv").config();

const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// =====================================================
// ROUTES
// =====================================================

app.use("/api/pizzas", pizzaRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.send("Pizza Palace API Running...");
});

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});