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
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      if (!address.trim() || !phoneNumber.trim()) {
        alert("Please fill in all fields.");
        return;
      }

      setLoading(true);

      const totalPrice = cart.reduce(
        (total, item) =>
          total + item.sizes[0].price * item.quantity,
        0
      );

      const { data } = await api.post("/orders", {
        userId: user._id || user.id,
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

      // Clear cart
      setCart([]);
      localStorage.removeItem("cart");

      // Redirect
      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Order failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Checkout 🍕
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">

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
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </div>
    </div>
  );
}

export default Checkout;