import { useContext } from "react";
import {
  ShoppingCart,
  Star,
  Heart,
} from "lucide-react";

import { CartContext } from "../context/CartContext";

function PizzaCard({ pizza }) {
  const { cart, setCart } = useContext(CartContext);

  const addToCart = () => {
    const existingPizza = cart.find(
      (item) => item._id === pizza._id
    );

    if (existingPizza) {
      const updatedCart = cart.map((item) =>
        item._id === pizza._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...pizza,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <div className="group w-full max-w-[320px] overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* ================= IMAGE ================= */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">

        <img
          src={pizza.image}
          alt={pizza.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            console.error(
              "Pizza image failed:",
              pizza.image
            );
          }}
        />

        {/* CATEGORY BADGE */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold text-white shadow ${
              pizza.category === "veg"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {pizza.category === "veg"
              ? "VEG"
              : "NON-VEG"}
          </span>
        </div>

        {/* FAVORITE */}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md transition hover:scale-110 hover:text-red-500"
        >
          <Heart size={17} />
        </button>

        {/* RATING */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <Star
            size={13}
            fill="currentColor"
            className="text-yellow-400"
          />
          4.8
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="p-4">

        {/* NAME */}
        <h2 className="truncate text-xl font-bold text-gray-900">
          {pizza.name}
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-1.5 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
          {pizza.description}
        </p>

        {/* DELIVERY */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="text-green-600">
            ⚡ Fast Delivery
          </span>

          <span>•</span>

          <span>25–30 min</span>
        </div>

        {/* ================= PRICES ================= */}
        <div className="mt-3 space-y-1.5">

          {pizza.sizes?.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5 text-sm transition hover:bg-orange-50"
            >
              <span className="capitalize text-gray-600">
                {item.size}
              </span>

              <span className="font-bold text-gray-900">
                ₹{item.price}
              </span>
            </div>
          ))}

        </div>

        {/* ================= ADD TO CART ================= */}
        <button
          onClick={addToCart}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-orange-600 hover:shadow-md active:scale-95"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default PizzaCard;