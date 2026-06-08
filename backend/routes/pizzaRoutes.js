const express = require("express");

const {
  getAllPizzas,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", getAllPizzas);

router.post("/", verifyToken, isAdmin, createPizza);

router.put("/:id", verifyToken, isAdmin, updatePizza);

router.delete("/:id", verifyToken, isAdmin, deletePizza);

module.exports = router;