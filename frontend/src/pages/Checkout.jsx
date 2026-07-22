import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first.");
        return;
      }

      if (!address || !phoneNumber) {
        alert("Please fill in all fields.");
        return;
      }

      const totalPrice = cart.reduce(
        (total, item) =>
          total + item.sizes[0].price * item.quantity,
        0
      );

      const { data } = await api.post("/orders", {
        userId: user.id || user._id,
        items: cart,
        totalPrice,
        address,
        phoneNumber,
        paymentMethod,
      });

      if (paymentMethod === "ONLINE") {
        alert("Payment Successful ✅");
      }

      alert(data.message);

      setCart([]);

      navigate("/");
    } catch (error) {
      console.error(error);

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
          <option value="COD">Cash On Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>

        <button
          onClick={handlePlaceOrder}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;