import { useContext } from "react";

import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {

  const { cart, setCart } = useContext(CartContext);

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cart.filter(
      (_, index) => index !== indexToRemove
    );

    setCart(updatedCart);
  };

  const increaseQuantity = (id) => {

  const updatedCart = cart.map((item) =>
    item._id === id
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  setCart(updatedCart);
};

const decreaseQuantity = (id) => {

  const updatedCart = cart
    .map((item) =>
      item._id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  setCart(updatedCart);
};

  // Total Price
  const totalPrice = cart.reduce((total, item) => {
  return total + (item.sizes[0].price * item.quantity);
   }, 0);
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Your Cart 🛒
      </h1>

      {cart.length === 0 ? (
        <p className="text-xl">
          Cart is empty
        </p>
      ) : (
        <>
          <div className="space-y-5">

            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-2xl font-bold">
            {item.name} × {item.quantity}
              </h2>

                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">

  <p className="text-xl font-semibold text-orange-500">
    ₹{item.sizes[0].price * item.quantity}
  </p>

  {/* Quantity Buttons */}
  <div className="flex items-center gap-3">

    <button
      onClick={() => decreaseQuantity(item._id)}
      className="bg-red-500 text-white px-3 py-1 rounded-lg"
    >
      -
    </button>

    <span className="text-xl font-bold">
      {item.quantity}
    </span>

    <button
      onClick={() => increaseQuantity(item._id)}
      className="bg-green-500 text-white px-3 py-1 rounded-lg"
    >
      +
    </button>

  </div>

  {/* Remove Button */}
  <button
    onClick={() => removeFromCart(index)}
    className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-black"
  >
    Remove
  </button>

</div>

                  <p className="text-xl font-semibold text-orange-500">
                    ₹{item.sizes[0].price}
                  </p>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>

                </div>
            
            ))}

          </div>

          {/* Total Price */}
          <div className="mt-10 bg-white p-5 rounded-xl shadow-md flex justify-between items-center">

            <h2 className="text-3xl font-bold">
              Total
            </h2>

            <p className="text-3xl font-bold text-orange-500">
              ₹{totalPrice}
            </p>
         <Link to="/checkout">
  <button
    className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600"
  >
    Proceed to Checkout
  </button>
</Link>

          </div>
        </>
      
      )}
     

    </div>
  );
}

export default Cart;