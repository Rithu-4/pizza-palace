import { useState, useEffect } from "react";
import api from "../api/axios";

function Admin() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [pizzas, setPizzas] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPizzas();
    fetchOrders();
  }, []);

  // Fetch all pizzas
  const fetchPizzas = async () => {
    try {
      const { data } = await api.get("/pizzas");
      setPizzas(data.pizzas);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });

      alert("Order Status Updated");

      fetchOrders();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update status"
      );
    }
  };

  // Add pizza
  const handleAddPizza = async () => {
    try {
      const { data } = await api.post("/pizzas", {
        name,
        description,
        image,
        category,
      });

      alert(data.message);

      setName("");
      setDescription("");
      setImage("");
      setCategory("");

      fetchPizzas();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to add pizza"
      );
    }
  };

  // Delete pizza
  const handleDeletePizza = async (id) => {
    try {
      await api.delete(`/pizzas/${id}`);

      alert("Pizza deleted successfully");

      fetchPizzas();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete pizza"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard 👨‍🍳
      </h1>

      {/* Add Pizza */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
        <input
          type="text"
          placeholder="Pizza Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">Select Category</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>

        <button
          onClick={handleAddPizza}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Add Pizza
        </button>
      </div>

      {/* Orders */}
      <h2 className="text-3xl font-bold mt-10 mb-5">
        Order Management 📦
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>

            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <p>
              <strong>Address:</strong> {order.address}
            </p>

            <p>
              <strong>Status:</strong>
            </p>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
              className="border p-2 rounded mt-2"
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>

      {/* Pizza Catalogue */}
      <h2 className="text-3xl font-bold mt-10 mb-5">
        Pizza Catalogue 🍕
      </h2>

      <div className="space-y-4">
        {pizzas.map((pizza) => (
          <div
            key={pizza._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-xl">
                {pizza.name}
              </h3>

              <p>{pizza.category}</p>
            </div>

            <button
              onClick={() => handleDeletePizza(pizza._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;