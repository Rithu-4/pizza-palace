import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Flame,
  Star,
} from "lucide-react";

import PizzaCard from "../components/PizzaCard";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [pizzas, setPizzas] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cart } = useContext(CartContext);

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://pizza-palace-10.onrender.com/api/pizzas",
        {
          timeout: 10000,
        }
      );

      const pizzasWithImages = (response.data.pizzas || []).map(
        (pizza, index) => ({
          ...pizza,
          image: `/pizza${index + 1}.webp`,
        })
      );

      setPizzas(pizzasWithImages);
    } catch (err) {
      console.error("Pizza loading error:", err);
      setError("We couldn't load the menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  let filteredPizzas = pizzas.filter((pizza) => {
    const categoryMatch =
      category === "all" || pizza.category === category;

    const searchMatch = pizza.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  if (sort === "low") {
    filteredPizzas = [...filteredPizzas].sort((a, b) => {
      const priceA = a.sizes?.[0]?.price || 0;
      const priceB = b.sizes?.[0]?.price || 0;

      return priceA - priceB;
    });
  }

  if (sort === "high") {
    filteredPizzas = [...filteredPizzas].sort((a, b) => {
      const priceA = a.sizes?.[0]?.price || 0;
      const priceB = b.sizes?.[0]?.price || 0;

      return priceB - priceA;
    });
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-gray-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111] text-white shadow-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg">

              <div className="absolute inset- 3px rounded-xl border border-white/30"></div>

              <span className="relative text-lg font-black tracking-[-0.15em] text-white">
                PP
              </span>

            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                Pizza
                <span className="text-orange-500">
                  Palace
                </span>
              </h1>

              <p className="hidden text-[8px] font-medium uppercase tracking-[0.28em] text-gray-500 sm:block">
                Crafted for cravings
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white sm:flex"
            >
              <ArrowLeft size={17} />
              Home
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold transition hover:bg-orange-600"
            >
              <ShoppingCart size={17} />

              <span className="hidden sm:inline">
                Cart
              </span>

              <span className="rounded-full bg-white/20 px-2 py-0.5">
                {cart.length}
              </span>
            </Link>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#151515] text-white">

        <div className="absolute -right-40 -top-40 h- 450px w- 450px rounded-full bg-orange-500/10 blur-3xl"></div>

        <div className="absolute -bottom-40 -left-40 h-400px w- 400px rounded-full bg-red-500/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">

              <Flame size={15} />

              Our Menu

            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find your
              <span className="block text-orange-500">
                perfect pizza.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              From classic favorites to loaded specialties,
              discover a pizza made just for your cravings.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />

                <div>
                  <p className="text-sm font-bold">
                    4.8 / 5
                  </p>

                  <p className="text-xs text-gray-500">
                    Customer rating
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <p className="text-sm font-bold">
                  Fresh ingredients
                </p>

                <p className="text-xs text-gray-500">
                  Made with care
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* Search */}
        <div className="relative">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your favorite pizza..."
            className="w-full rounded-2xl border border-[#e5ded4] bg-white py-4 pl-14 pr-5 text-sm font-medium text-gray-800 shadow-sm outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          />

        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-2 overflow-x-auto pb-1">

            <SlidersHorizontal
              size={18}
              className="mr-1 shrink-0 text-gray-400"
            />

            <button
              onClick={() => setCategory("all")}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold ${
                category === "all"
                  ? "bg-[#151515] text-white shadow-lg"
                  : "border border-[#e5ded4] bg-white text-gray-600"
              }`}
            >
              🍕 All Pizzas
            </button>

            <button
              onClick={() => setCategory("veg")}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold ${
                category === "veg"
                  ? "bg-green-600 text-white shadow-lg"
                  : "border border-[#e5ded4] bg-white text-gray-600"
              }`}
            >
              🟢 Vegetarian
            </button>

            <button
              onClick={() => setCategory("non-veg")}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold ${
                category === "non-veg"
                  ? "bg-red-600 text-white shadow-lg"
                  : "border border-[#e5ded4] bg-white text-gray-600"
              }`}
            >
              🔴 Non-Vegetarian
            </button>

          </div>

          <div className="relative">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#e5ded4] bg-white py-3 pl-4 pr-11 text-sm font-semibold text-gray-700 shadow-sm outline-none lg:w-60"
            >
              <option value="default">
                Sort: Recommended
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

          </div>
        </div>

        {/* Heading */}
        <div className="mt-12">

          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-orange-500">
            Freshly prepared
          </p>

          <h3 className="text-3xl font-black tracking-tight text-[#171717]">
            Our Pizzas
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {filteredPizzas.length}{" "}
            {filteredPizzas.length === 1
              ? "pizza"
              : "pizzas"}{" "}
            available
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                <div className="h-52 animate-pulse bg-gray-200"></div>

                <div className="space-y-3 p-5">

                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100"></div>

                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100"></div>

                  <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200"></div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

            <div className="text-6xl">
              🍕
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Something went wrong
            </h3>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchPizzas}
              className="mt-6 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white hover:bg-orange-600"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Pizza Grid */}
        {!loading &&
          !error &&
          filteredPizzas.length > 0 && (
            <div className="mt-8 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={pizza._id}
                  pizza={pizza}
                />
              ))}

            </div>
          )}

        {/* No Results */}
        {!loading &&
          !error &&
          filteredPizzas.length === 0 && (
            <div className="mt-8 rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

              <div className="text-6xl">
                🔍
              </div>

              <h3 className="mt-5 text-2xl font-black text-gray-700">
                No pizzas found
              </h3>

              <p className="mt-2 text-gray-400">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setSort("default");
                }}
                className="mt-6 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white hover:bg-orange-600"
              >
                Clear Filters
              </button>

            </div>
          )}

      </main>

      {/* Footer */}
      <footer className="bg-[#111111] px-5 py-12 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">

          <div>

            <h3 className="text-xl font-black">
              Pizza
              <span className="text-orange-500">
                Palace
              </span>
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Crafted for cravings
            </p>

          </div>

          <p className="text-sm text-gray-500">
            Freshly baked. Deliciously delivered.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Menu;