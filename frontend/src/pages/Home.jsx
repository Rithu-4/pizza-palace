import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PizzaCard from "../components/PizzaCard";
import { CartContext } from "../context/CartContext";

function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { cart } = useContext(CartContext);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

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
  }, []);

  const filteredPizzas = pizzas.filter((pizza) => {
    const categoryMatch =
      category === "all" ||
      pizza.category === category;

    const searchMatch = pizza.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Navbar */}
      <div className="bg-black text-white py-5 px-5 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">

        <h1 className="text-3xl font-bold text-orange-500">
          Pizza Palace 🍕
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-3">

          <h2 className="text-lg">
            Welcome {user?.name} 👋
          </h2>

          <Link to="/cart">
            <button className="bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600">
              Cart ({cart.length})
            </button>
          </Link>

          <Link to="/orders">
            <button className="bg-blue-500 px-5 py-2 rounded-lg hover:bg-blue-600">
              My Orders
            </button>
          </Link>

          <Link to="/admin">
            <button className="bg-purple-500 px-5 py-2 rounded-lg hover:bg-purple-600">
              Admin
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search Pizza 🍕"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full bg-white"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 px-4 mb-8">

        <button
          onClick={() => setCategory("all")}
          className={`px-4 py-2 rounded text-white ${
            category === "all"
              ? "bg-gray-800"
              : "bg-black"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setCategory("veg")}
          className={`px-4 py-2 rounded text-white ${
            category === "veg"
              ? "bg-green-700"
              : "bg-green-500"
          }`}
        >
          Veg
        </button>

        <button
          onClick={() => setCategory("non-veg")}
          className={`px-4 py-2 rounded text-white ${
            category === "non-veg"
              ? "bg-red-700"
              : "bg-red-500"
          }`}
        >
          Non-Veg
        </button>

      </div>

      {/* Pizza Section */}
      <div className="p-4 md:p-10">

        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Our Delicious Pizzas
        </h2>

        <p className="mb-6 text-gray-600 font-medium">
          {filteredPizzas.length} pizza(s) found
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {filteredPizzas.length > 0 ? (
            filteredPizzas.map((pizza) => (
              <PizzaCard
                key={pizza._id}
                pizza={pizza}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              <h2 className="text-2xl font-bold text-gray-500">
                No pizzas found 🍕
              </h2>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Home;