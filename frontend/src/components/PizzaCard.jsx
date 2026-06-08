import { useContext } from "react";

import { CartContext } from "../context/CartContext";

function PizzaCard({ pizza }) {

  const { cart, setCart } = useContext(CartContext);

  const addToCart = () => {

  const existingPizza = cart.find(
    (item) => item._id === pizza._id
  );

  if (existingPizza) {

    const updatedCart = cart.map((item) =>
      item._id === pizza._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);

  } else {

    setCart([
      ...cart,
      { ...pizza, quantity: 1 }
    ]);

  }
};

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-75 hover:scale-105 transition duration-300">

      {/* Pizza Image */}
      <img
        src={pizza.image}
        alt={pizza.name}
        className="w-full h-55 object-cover"
      />

      {/* Pizza Details */}
      <div className="p-4">

        <h2 className="text-2xl font-bold text-gray-800">
          {pizza.name}
        </h2>

        <p className="text-gray-600 mt-2">
          {pizza.description}
        </p>

        <p className="mt-2">
          <span className="font-semibold">
            Category:
          </span>{" "}
          {pizza.category}
        </p>

        <div className="mt-3">

          {pizza.sizes.map((item) => (
            <div
              key={item._id}
              className="flex justify-between"
            >
              <span className="capitalize">
                {item.size}
              </span>

              <span>
                ₹{item.price}
              </span>
            </div>
          ))}

        </div>

        <button
          onClick={addToCart}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full mt-4"
        >
          Add To Cart
        </button>

      </div>
    </div>
  );
}

export default PizzaCard;