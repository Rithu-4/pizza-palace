import { useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

function Checkout() {

  const { cart, setCart } = useContext(CartContext);

  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handlePlaceOrder = async () => {
    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const totalPrice = cart.reduce(
        (total, item) =>
          total + item.sizes[0].price * item.quantity,
        0
      );

      const response = await axios.post(
        "https://pizza-palace-4.onrender.com/api/orders",
        {
          userId: user.id,
          items: cart,
          totalPrice,
          address,
          phoneNumber,
          paymentMethod,
        }
      );

      if (paymentMethod === "ONLINE") {
        alert("Payment Successful ✅");
      }

      alert(response.data.message);

      setCart([]);

      window.location.href = "/";

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Order failed"
      );

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Checkout 🍕
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <input
          type="text"
          placeholder="Enter Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="COD">
            Cash On Delivery
          </option>

          <option value="ONLINE">
            Online Payment
          </option>
        </select>

        <button
          onClick={handlePlaceOrder}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          Place Order
        </button>

      </div>

    </div>
  );
}

export default Checkout;