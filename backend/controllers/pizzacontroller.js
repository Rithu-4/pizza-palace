const Pizza = require("../models/pizza");

const createPizza = async (req, res) => {
try {


const {
  name,
  description,
  image,
  category,
} = req.body;

const pizza = await Pizza.create({
  name,
  description,
  image,
  category,
  sizes: [
    {
      size: "Medium",
      price: 299,
    },
  ],
});

res.status(201).json({
  success: true,
  message: "Pizza added successfully",
  pizza,
});


} catch (error) {


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

const getAllPizzas = async (req, res) => {
try {


const pizzas = await Pizza.find();

res.status(200).json({
  success: true,
  pizzas,
});


} catch (error) {

res.status(500).json({
  success: false,
  message: error.message,
});


}
};

const updatePizza = async (req, res) => {
try {


const updatedPizza = await Pizza.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
);

if (!updatedPizza) {
  return res.status(404).json({
    success: false,
    message: "Pizza not found",
  });
}

res.status(200).json({
  success: true,
  message: "Pizza updated successfully",
  pizza: updatedPizza,
});


} catch (error) {


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

const deletePizza = async (req, res) => {
try {


const pizza = await Pizza.findById(req.params.id);

if (!pizza) {
  return res.status(404).json({
    success: false,
    message: "Pizza not found",
  });
}

await pizza.deleteOne();

res.status(200).json({
  success: true,
  message: "Pizza deleted successfully",
});

} catch (error) {


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

module.exports = {
createPizza,
getAllPizzas,
updatePizza,
deletePizza,
};
