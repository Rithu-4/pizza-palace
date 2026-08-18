import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  Flame,
  ChevronRight,
} from "lucide-react";

import PizzaCard from "../components/PizzaCard";
import { CartContext } from "../context/CartContext";

function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cart } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =========================
  // FETCH PIZZAS
  // =========================
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

      const pizzasWithImages = (
        response.data.pizzas || []
      ).map((pizza, index) => ({
        ...pizza,
        image: `/pizza${index + 1}.webp`,
      }));

      setPizzas(pizzasWithImages);
    } catch (error) {
      console.error("Pizza loading error:", error);

      setError(
        "We couldn't load the menu. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // =========================
  // SEARCH + CATEGORY FILTER
  // =========================
  const filteredPizzas = pizzas.filter((pizza) => {
    const categoryMatch =
      category === "all" ||
      pizza.category === category;

    const searchMatch =
      pizza.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 text-white shadow-xl backdrop-blur-xl">

        <div className="mx-auto flex h- 72px max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* LOGO */}
<Link
  to="/"
  className="group flex items-center gap-3"
>
  {/* Premium PP Logo */}

  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg shadow-orange-500/20 transition duration-300 group-hover:scale-105">

    {/* Inner border */}

    <div className="absolute inset- 3px rounded-xl border border-white/30" />

    {/* PP */}

    <span className="relative text-lg font-black tracking-[-0.15em] text-white">
      PP
    </span>

  </div>

  {/* Brand */}

  <div>

    <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
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

          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/"
              className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Home
            </Link>

            <a
              href="#menu"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Menu
            </a>

            <Link
              to="/orders"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              My Orders
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                Admin
              </Link>
            )}

            <Link to="/cart">
              <button className="ml-2 flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20">
                <ShoppingCart size={17} />

                Cart

                <span className="rounded-full bg-white/20 px-2 py-0.5">
                  {cart.length}
                </span>
              </button>
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
              >
                Logout
              </button>
            )}

          </div>

          {/* MOBILE BUTTON */}

          <button
            className="rounded-xl border border-white/10 p-2.5 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#111111] px-5 py-5 md:hidden">

            <div className="mb-5 rounded-2xl bg-white/5 p-4">

              <p className="text-xs uppercase tracking-wider text-gray-500">
                Welcome back
              </p>

              <p className="mt-1 font-bold text-white">
                {user?.name || "Guest"} 👋
              </p>

            </div>

            <div className="flex flex-col gap-2">

              <a
                href="#menu"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5"
              >
                Menu
              </a>

              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5"
              >
                My Orders
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5"
                >
                  Admin
                </Link>
              )}

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
              >
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold">
                  <ShoppingCart size={18} />
                  Cart ({cart.length})
                </button>
              </Link>

              {user && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-xl py-3 text-red-400 transition hover:bg-red-500/10"
                >
                  Logout
                </button>
              )}

            </div>
          </div>
        )}

      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#111111] text-white">

        {/* Decorative background */}

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute -bottom-40 left-10 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* HERO TEXT */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <Flame size={14} />
                Freshly baked for you
              </div>

              <h2 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Good food.
                <span className="block text-orange-500">
                  Good mood.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
                Handcrafted pizzas made with fresh
                ingredients, loaded with flavor and
                delivered hot to your doorstep.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href="#menu"
                  className="group flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30"
                >
                  Explore Menu

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <ShoppingCart size={18} />
                  View Cart
                </Link>

              </div>

              {/* STATS */}

              <div className="mt-10 flex flex-wrap gap-7">

                <div>
                  <p className="text-2xl font-black">
                    10+
                  </p>

                  <p className="text-xs text-gray-500">
                    Pizza Choices
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>

                  <p className="flex items-center gap-1 text-2xl font-black">
                    4.8
                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-400"
                    />
                  </p>

                  <p className="text-xs text-gray-500">
                    Customer Rating
                  </p>

                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>

                  <p className="text-2xl font-black">
                    30m
                  </p>

                  <p className="text-xs text-gray-500">
                    Fast Delivery
                  </p>

                </div>

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="relative flex justify-center">

              <div className="absolute h-72 w-72 rounded-full bg-orange-500/20 blur-3xl sm:h-96 sm:w-96" />

              <div className="relative">

                <img
                  src="/pizza1.webp"
                  alt="Fresh Pizza"
                  fetchPriority="high"
                  decoding="async"
                  className="h-72 w-72 rounded-full object-cover shadow-2xl shadow-orange-500/10 ring-8 ring-white/5 sm:h-96 sm:w-96"
                />

                {/* Floating badge */}

                <div className="absolute -right-5 top-10 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 font-bold">
                      ✓
                    </div>

                    <div>
                      <p className="text-xs font-bold">
                        Freshly Baked
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Made with love
                      </p>
                    </div>

                  </div>

                </div>

                {/* PRICE */}

                <div className="absolute -bottom-4 -left-5 rounded-2xl bg-orange-500 px-5 py-3 shadow-xl">

                  <p className="text-[10px] text-orange-100">
                    Starting from
                  </p>

                  <p className="text-xl font-black">
                    ₹249
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          BENEFITS
      ====================================================== */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="flex items-center gap-4 px-6 py-7 sm:justify-center">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Clock size={22} />
            </div>

            <div>
              <p className="font-bold">
                Fast Delivery
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Hot pizza at your door
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 px-6 py-7 sm:justify-center">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="font-bold">
                Fresh Ingredients
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Quality you can taste
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 px-6 py-7 sm:justify-center">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
              <Star
                size={22}
                fill="currentColor"
              />
            </div>

            <div>
              <p className="font-bold">
                Top Rated
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Loved by pizza lovers
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MENU SECTION
      ====================================================== */}

      <section
        id="menu"
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8"
      >

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Our Menu
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Choose your favorite
            </h2>

            <p className="mt-2 text-gray-500">
              Freshly prepared just for you.
            </p>

          </div>

          <Link
            to="/menu"
            className="group flex items-center gap-1 text-sm font-bold text-orange-500 transition hover:text-orange-600"
          >
            View Full Menu

            <ChevronRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

        {/* SEARCH */}

        <div className="mt-8 relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search your favorite pizza..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-5 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
          />

        </div>

        {/* CATEGORIES */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">

          <button
            onClick={() => setCategory("all")}
            className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition ${
              category === "all"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            🍕 All Pizzas
          </button>

          <button
            onClick={() => setCategory("veg")}
            className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition ${
              category === "veg"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            🟢 Vegetarian
          </button>

          <button
            onClick={() => setCategory("non-veg")}
            className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition ${
              category === "non-veg"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            🔴 Non-Vegetarian
          </button>

        </div>

      </section>

      {/* =====================================================
          PIZZAS
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">

        <div className="mb-8">

          <p className="text-sm font-semibold text-gray-400">
            {filteredPizzas.length}{" "}
            {filteredPizzas.length === 1
              ? "pizza"
              : "pizzas"}{" "}
            available
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="w-full max-w-[320px] overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  <div className="h-48 animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-5">

                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />

                    <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

            <div className="text-6xl">
              🍕
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Something went wrong
            </h2>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchPizzas}
              className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>

          </div>
        )}

        {/* PIZZA GRID */}

        {!loading &&
          !error &&
          filteredPizzas.length > 0 && (
            <div className="grid grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={pizza._id}
                  pizza={pizza}
                />
              ))}

            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredPizzas.length === 0 && (
            <div className="rounded-3xl bg-white py-20 text-center shadow-sm">

              <div className="text-6xl">
                🔍
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-700">
                No pizzas found
              </h2>

              <p className="mt-2 text-gray-400">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                View All Pizzas
              </button>

            </div>
          )}

      </main>

      {/* =====================================================
          PROMO CTA
      ====================================================== */}

      <section className="px-5 pb-16 lg:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-12 text-center text-white shadow-xl sm:px-10">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
            Hungry yet?
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Your next favorite pizza is waiting.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-orange-100">
            Pick your favorite pizza, add it to your
            cart and enjoy it hot and fresh.
          </p>

          <Link
            to="/menu"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-orange-600 shadow-lg transition hover:-translate-y-1"
          >
            Explore Full Menu
            <ChevronRight size={18} />
          </Link>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-[#111111] px-5 py-12 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 md:grid-cols-3">

            {/* BRAND */}

             <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg shadow-orange-500/20 transition duration-300 group-hover:scale-105">

              <div className="absolute inset-[3px] rounded-xl border border-white/30" />

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


            {/* LINKS */}

            <div>

              <h4 className="font-bold">
                Quick Links
              </h4>

              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">

                <Link
                  to="/"
                  className="transition hover:text-orange-500"
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  className="transition hover:text-orange-500"
                >
                  Menu
                </Link>

                <Link
                  to="/orders"
                  className="transition hover:text-orange-500"
                >
                  My Orders
                </Link>

                <Link
                  to="/cart"
                  className="transition hover:text-orange-500"
                >
                  Cart
                </Link>

              </div>

            </div>

            {/* WHY US */}

            <div>

              <h4 className="font-bold">
                Why Pizza Palace?
              </h4>

              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">

                <span>⚡ Fast delivery</span>

                <span>🥬 Fresh ingredients</span>

                <span>⭐ Top rated pizzas</span>

                <span>❤️ Made with love</span>

              </div>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-600">
            © 2026 Pizza Palace. Built with React & MERN Stack.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;