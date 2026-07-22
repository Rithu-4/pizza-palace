import { useEffect, useState } from "react";
import api from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          alert("Please login first.");
          return;
        }

        const { data } = await api.get(
          `/orders/${user._id || user.id}`
        );

        setOrders(data.orders);
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
          "Failed to fetch orders"
        );
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);

      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order._id !== id
        )
      );

      alert("Order cancelled successfully");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to cancel order"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        My Orders 📦
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 text-lg">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-bold mb-2">
                Order ID
              </h2>

              <p className="break-all">
                {order._id}
              </p>

              <p className="mt-3">
                <strong>Total:</strong> ₹
                {order.totalPrice}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {order.address}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {order.phoneNumber}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    order.status === "Pending"
                      ? "text-yellow-500 font-bold"
                      : order.status === "Preparing"
                      ? "text-blue-500 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  {order.status === "Pending" &&
                    "⏳ Pending"}
                  {order.status === "Preparing" &&
                    "👨‍🍳 Preparing"}
                  {order.status === "Delivered" &&
                    "✅ Delivered"}
                </span>
              </p>

              {order.status === "Pending" && (
                <button
                  onClick={() =>
                    handleDeleteOrder(order._id)
                  }
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;