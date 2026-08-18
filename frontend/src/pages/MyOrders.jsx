import { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          console.log("User not found in localStorage");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // Get user ID
        const userId = user?._id || user?.id;

        if (!userId) {
          console.log("User ID not found");
          setLoading(false);
          return;
        }

        console.log("Fetching orders for user:", userId);

        const response = await axios.get(
          `https://pizza-palace-10.onrender.com/api/orders/${userId}`
          
        );

        console.log("Orders response:", response.data);

        // Depending on your controller response
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===============================
  // DELETE / CANCEL ORDER
  // ===============================

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(
        `https://pizza-palace-10.onrender.com/api/orders/${id}`
      );

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order._id !== id
        )
      );

      alert("Order cancelled successfully");
    } catch (error) {
      console.error(
        "Delete order error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <h1 className="mb-8 text-4xl font-bold">
          My Orders 📦
        </h1>

        <p className="text-gray-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10 sm:px-10">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-4xl font-bold">
          My Orders 📦
        </h1>

        {/* NO ORDERS */}

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">

            <div className="text-5xl">
              📦
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              No orders found
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-800">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Ordered on
                    </p>

                    <p className="text-sm font-semibold">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                </div>

                {/* ITEMS */}

                <div className="py-5">

                  <h3 className="mb-3 text-lg font-bold">
                    Items
                  </h3>

                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-3 last:border-b-0"
                    >

                      <div>
                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>

                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                      </div>

                      <p className="font-bold">
                        ₹
                        {Number(item.price || 0) *
                          Number(item.quantity || 1)}
                      </p>

                    </div>
                  ))}

                </div>

                {/* PRICE */}

                <div className="space-y-2 border-t pt-4 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span>
                      ₹{order.subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Delivery Fee
                    </span>

                    <span>
                      ₹{order.deliveryFee}
                    </span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Discount
                      </span>

                      <span className="font-semibold text-green-600">
                        -₹{order.discount}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>
                      Total
                    </span>

                    <span>
                      ₹{order.total}
                    </span>
                  </div>

                </div>

                {/* PAYMENT */}

                <div className="mt-5 flex flex-wrap gap-3">

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                    💳 {order.paymentStatus || "Paid"}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status === "Pending"
                      ? "⏳ Pending"
                      : order.status === "Delivered"
                      ? "✅ Delivered"
                      : order.status}
                  </span>

                </div>

                {/* ADDRESS */}

                <div className="mt-5 rounded-xl bg-gray-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Delivery Address
                  </p>

                  <p className="mt-2 text-sm text-gray-700">
                    {order.customer?.address || "N/A"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.customer?.city || ""}
                    {order.customer?.pincode
                      ? ` - ${order.customer.pincode}`
                      : ""}
                  </p>

                </div>

                {/* CANCEL */}

                {order.status === "Pending" && (
                  <button
                    onClick={() =>
                      handleDeleteOrder(order._id)
                    }
                    className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default MyOrders;