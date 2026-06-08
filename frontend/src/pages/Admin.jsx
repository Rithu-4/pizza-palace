import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {

const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [image, setImage] = useState("");
const [category, setCategory] = useState("");

const [pizzas, setPizzas] = useState([]);
const [orders, setOrders] = useState([]);

const fetchPizzas = async () => {
try {


  const response = await axios.get(
    "http://localhost:5000/api/pizzas"
  );

  setPizzas(response.data.pizzas);

} catch (error) {
  console.log(error);
}


};
useEffect(() => {
  fetchPizzas();
  fetchOrders();
}, []);


const fetchOrders = async () => {
  try {

    const response = await axios.get(
      "http://localhost:5000/api/orders"
    );

    setOrders(response.data.orders);

  } catch (error) {

    console.log(error);

  }
};

const updateStatus = async (id, status) => {
  try {

    await axios.put(
      `http://localhost:5000/api/orders/${id}`,
      { status }
    );

    alert("Order Status Updated");

    fetchOrders();

  } catch (error) {

    console.log(error);

  }
};
const handleAddPizza = async () => {
try {


  const token = localStorage.getItem("token");

  const response = await axios.post(
    "http://localhost:5000/api/pizzas",
    {
      name,
      description,
      image,
      category,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert(response.data.message);

  setName("");
  setDescription("");
  setImage("");
  setCategory("");

  fetchPizzas();

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    error.message
  );

}


};

const handleDeletePizza = async (id) => {
try {


  const token = localStorage.getItem("token");

  await axios.delete(
    `http://localhost:5000/api/pizzas/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Pizza deleted successfully");

  fetchPizzas();

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    error.message
  );

}


};

return ( <div className="min-h-screen bg-gray-100 p-10">


  <h1 className="text-4xl font-bold mb-8">
    Admin Dashboard 👨‍🍳
  </h1>

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
      <option value="">
        Select Category
      </option>

      <option value="veg">
        Veg
      </option>

      <option value="non-veg">
        Non-Veg
      </option>
    </select>

    <button
      onClick={handleAddPizza}
      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
    >
      Add Pizza
    </button>

  </div>

 


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
        <strong>Order ID:</strong>
        {" "}
        {order._id}
      </p>

      <p>
        <strong>Total:</strong>
        ₹{order.totalPrice}
      </p>

      <p>
        <strong>Address:</strong>
        {" "}
        {order.address}
      </p>

      <p>
        <strong>Status:</strong>
      </p>

      <select
        value={order.status}
        onChange={(e) =>
          updateStatus(
            order._id,
            e.target.value
          )
        }
        className="border p-2 rounded mt-2"
      >
        <option value="Pending">
          Pending
        </option>

        <option value="Preparing">
          Preparing
        </option>

        <option value="Delivered">
          Delivered
        </option>

      </select>

    </div>
  ))}

</div>

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
          onClick={() =>
            handleDeletePizza(pizza._id)
          }
          className="bg-red-500 text-white px-4 py-2 rounded"
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
