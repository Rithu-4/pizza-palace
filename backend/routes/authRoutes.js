const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authcontroller");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getProfile);

module.exports = router;