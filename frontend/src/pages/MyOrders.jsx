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

        const { data } = await api.get(`/orders/${user.id}`);

        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== id)
      );

      alert("Order deleted successfully");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        My Orders 📦
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-bold">
                Order ID:
              </h2>

              <p>{order._id}</p>

              <p className="mt-2">
                Total: ₹{order.totalPrice}
              </p>

              <p
                className={
                  order.status === "Pending"
                    ? "text-yellow-500 font-bold"
                    : "text-green-500 font-bold"
                }
              >
                {order.status === "Pending"
                  ? "⏳ Pending"
                  : "✅ Delivered"}
              </p>

              <p>
                Address: {order.address}
              </p>

              {order.status === "Pending" && (
                <button
                  onClick={() =>
                    handleDeleteOrder(order._id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded mt-3 hover:bg-red-600"
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