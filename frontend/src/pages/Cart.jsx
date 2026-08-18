import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock3,
  Tag,
  ChevronRight,
} from "lucide-react";

import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // ----------------------------------
  // UPDATE QUANTITY
  // ----------------------------------
  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item._id !== id) {
          return item;
        }

        const newQuantity = item.quantity + change;

        return {
          ...item,
          quantity: newQuantity,
        };
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  // ----------------------------------
  // REMOVE ITEM
  // ----------------------------------
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    setCart(updatedCart);
  };

  // ----------------------------------
  // GET ITEM PRICE
  // ----------------------------------
  const getPrice = (item) => {
    // If your cart item has a selected size
    if (item.selectedSize?.price) {
      return Number(item.selectedSize.price);
    }

    // Otherwise use the first available size
    if (item.sizes?.length > 0) {
      return Number(item.sizes[0].price);
    }

    // Fallback
    return Number(item.price || 0);
  };

  // ----------------------------------
  // CALCULATE SUBTOTAL
  // ----------------------------------
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + getPrice(item) * item.quantity;
    }, 0);
  }, [cart]);

  // ----------------------------------
  // DELIVERY FEE
  // ----------------------------------
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;

  // ----------------------------------
  // DISCOUNT
  // ----------------------------------
  const discount = subtotal >= 799 ? 100 : 0;

  // ----------------------------------
  // TOTAL
  // ----------------------------------
  const total = subtotal + deliveryFee - discount;

  // ----------------------------------
  // TOTAL ITEMS
  // ----------------------------------
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ----------------------------------
  // EMPTY CART
  // ----------------------------------
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5ef]">

        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-[#111111] text-white shadow-lg">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg">

                <span className="text-sm font-black tracking-tight text-white">
                  PP
                </span>

              </div>

              <div>
                <h1 className="text-xl font-black sm:text-2xl">
                  Pizza
                  <span className="text-orange-500">
                    Palace
                  </span>
                </h1>

                <p className="hidden text-[8px] uppercase tracking-[0.25em] text-gray-500 sm:block">
                  Crafted for cravings
                </p>
              </div>

            </Link>

            <Link
              to="/menu"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">
                Browse Menu
              </span>
            </Link>

          </div>

        </nav>

        {/* Empty Cart */}
        <main className="mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center px-5 py-16">

          <div className="w-full rounded-3xl bg-white px-6 py-14 text-center shadow-sm sm:px-12">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">

              <ShoppingBag
                size={42}
                className="text-orange-500"
              />

            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.25em] text-orange-500">
              Your cart
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-900">
              Your cart is feeling lonely
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Looks like you haven't added anything yet.
              Explore our menu and find something delicious.
            </p>

            <Link
              to="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#151515] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              Explore Menu
              <ChevronRight size={18} />
            </Link>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      {/* =========================================
          NAVBAR
      ========================================== */}
      <nav className="sticky top-0 z-50 bg-[#111111] text-white shadow-lg">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg">

              <span className="text-sm font-black tracking-tight">
                PP
              </span>

            </div>

            <div>

              <h1 className="text-xl font-black sm:text-2xl">
                Pizza
                <span className="text-orange-500">
                  Palace
                </span>
              </h1>

              <p className="hidden text-[8px] uppercase tracking-[0.25em] text-gray-500 sm:block">
                Crafted for cravings
              </p>

            </div>

          </Link>

          <Link
            to="/menu"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">
              Continue Shopping
            </span>
          </Link>

        </div>

      </nav>

      {/* =========================================
          MAIN CONTENT
      ========================================== */}
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">

        {/* Header */}
        <div className="mb-10">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
            Almost there
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight text-[#151515] sm:text-5xl">
            Your Cart
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"} ready
            for your order.
          </p>

        </div>

        {/* =========================================
            CART + SUMMARY
        ========================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

          {/* =====================================
              CART ITEMS
          ====================================== */}
          <section>

            <div className="overflow-hidden rounded-3xl border border-[#ebe3d9] bg-white shadow-sm">

              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                    <ShoppingBag
                      size={20}
                      className="text-orange-500"
                    />

                  </div>

                  <div>

                    <h3 className="font-black text-gray-900">
                      Your Selection
                    </h3>

                    <p className="text-xs text-gray-400">
                      Freshly prepared for you
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                  {totalItems} items
                </span>

              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">

                {cart.map((item) => {

                  const price = getPrice(item);
                  const itemTotal = price * item.quantity;

                  return (
                    <div
                      key={item._id}
                      className="p-5 transition hover:bg-orange-50/30 sm:p-7"
                    >

                      <div className="flex gap-4 sm:gap-6">

                        {/* Image */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-32">

                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/pizza1.webp";
                            }}
                          />

                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <h3 className="text-base font-black text-gray-900 sm:text-lg">
                                {item.name}
                              </h3>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                {item.description}
                              </p>

                            </div>

                            <button
                              onClick={() =>
                                removeItem(item._id)
                              }
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                          {/* Category */}
                          <div className="mt-2">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                                item.category === "veg"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {item.category === "veg"
                                ? "Vegetarian"
                                : "Non-Veg"}
                            </span>

                          </div>

                          {/* Bottom */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                            {/* Quantity */}
                            <div className="flex items-center rounded-xl border border-gray-200 bg-white">

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    -1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-orange-500"
                              >
                                <Minus size={15} />
                              </button>

                              <span className="w-8 text-center text-sm font-black text-gray-800">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-orange-500"
                              >
                                <Plus size={15} />
                              </button>

                            </div>

                            {/* Price */}
                            <div className="text-right">

                              <p className="text-xs text-gray-400">
                                ₹{price} ×{" "}
                                {item.quantity}
                              </p>

                              <p className="text-lg font-black text-gray-900">
                                ₹{itemTotal}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* Offer Banner */}
            <div className="mt-5 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-5">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">

                  <Tag size={20} />

                </div>

                <div>

                  <h4 className="text-sm font-black text-gray-900">
                    Hungry for a better deal?
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Spend ₹799 or more and enjoy ₹100
                    off your order.
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================
              ORDER SUMMARY
          ====================================== */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">

            <div className="overflow-hidden rounded-3xl bg-[#151515] text-white shadow-xl">

              {/* Summary Header */}
              <div className="border-b border-white/10 px-6 py-6">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                  Checkout
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  Order Summary
                </h3>

              </div>

              <div className="px-6 py-6">

                {/* Price Details */}
                <div className="space-y-4 text-sm">

                  <div className="flex justify-between text-gray-400">
                    <span>
                      Subtotal
                    </span>

                    <span className="font-semibold text-white">
                      ₹{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>
                      Delivery Fee
                    </span>

                    <span
                      className={
                        deliveryFee === 0
                          ? "font-bold text-green-400"
                          : "font-semibold text-white"
                      }
                    >
                      {deliveryFee === 0
                        ? "FREE"
                        : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>
                        Discount
                      </span>

                      <span className="font-bold text-green-400">
                        -₹{discount}
                      </span>
                    </div>
                  )}

                </div>

                {/* Free Delivery */}
                {subtotal < 499 && (
                  <div className="mt-5 rounded-xl bg-white/5 p-3">

                    <div className="flex gap-3">

                      <Truck
                        size={18}
                        className="shrink-0 text-orange-400"
                      />

                      <p className="text-xs leading-5 text-gray-400">

                        Add{" "}
                        <span className="font-bold text-white">
                          ₹{499 - subtotal}
                        </span>{" "}
                        more to unlock{" "}
                        <span className="font-bold text-green-400">
                          FREE delivery
                        </span>
                        .

                      </p>

                    </div>

                  </div>
                )}

                {/* Divider */}
                <div className="my-6 border-t border-white/10"></div>

                {/* Total */}
                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Total amount
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      ₹{total}
                    </p>

                  </div>

                  <span className="mb-1 rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                    TAX INCLUDED
                  </span>

                </div>

                {/* Checkout */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:from-orange-400 hover:to-red-500"
                >
                  Proceed to Checkout
                  <ChevronRight size={19} />
                </button>

                {/* Security */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">

                  <ShieldCheck size={15} />

                  Secure checkout

                </div>

              </div>

            </div>

            {/* Benefits */}
            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-[#ebe3d9] bg-white p-4">

                <Truck
                  size={19}
                  className="text-orange-500"
                />

                <p className="mt-3 text-xs font-black text-gray-800">
                  Fast Delivery
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400">
                  Hot at your doorstep
                </p>

              </div>

              <div className="rounded-2xl border border-[#ebe3d9] bg-white p-4">

                <Clock3
                  size={19}
                  className="text-orange-500"
                />

                <p className="mt-3 text-xs font-black text-gray-800">
                  30–40 min
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400">
                  Estimated delivery
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#111111] px-5 py-8 text-center">

        <p className="text-sm font-bold text-white">
          Pizza
          <span className="text-orange-500">
            Palace
          </span>
        </p>

        <p className="mt-1 text-xs text-gray-600">
          Freshly baked. Deliciously delivered.
        </p>

      </footer>

    </div>
  );
}

export default Cart;