import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Truck,
  Tag,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Lock,
  Utensils,
  Home,
} from "lucide-react";

import LocationPicker from "../components/LocationPicker";
import { CartContext } from "../context/CartContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// =====================================================
// LOAD RAZORPAY
// =====================================================

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// =====================================================
// CHECKOUT
// =====================================================

function Checkout() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // =====================================================
  // STATE
  // =====================================================

  const [location, setLocation] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    pincode: "",
  });

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [errors, setErrors] = useState({});

  const [paymentLoading, setPaymentLoading] = useState(false);

  // =====================================================
  // PRICE HELPER
  // =====================================================

  const getPrice = (item) => {
    if (item.selectedSize?.price) {
      return Number(item.selectedSize.price);
    }

    if (item.sizes?.length > 0) {
      return Number(item.sizes[0].price);
    }

    return Number(item.price || 0);
  };

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = getPrice(item);
      const quantity = Number(item.quantity || 1);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  // =====================================================
  // DELIVERY
  // =====================================================

  const deliveryFee =
    subtotal === 0 || subtotal >= 499 ? 0 : 40;

  // =====================================================
  // DISCOUNT
  // =====================================================

  const discount = couponApplied ? 100 : 0;

  // =====================================================
  // TOTAL
  // =====================================================

  const total = Math.max(
    subtotal + deliveryFee - discount,
    0
  );

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // =====================================================
  // COUPON
  // =====================================================

  const applyCoupon = () => {
    const enteredCoupon = coupon.trim().toUpperCase();

    if (enteredCoupon === "PIZZA100") {
      setCouponApplied(true);
      alert("₹100 discount applied successfully!");
    } else {
      setCouponApplied(false);
      alert("Invalid coupon. Try PIZZA100");
    }
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Please enter your city.";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode =
        "Please enter your pincode.";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = async () => {
    // Validate form
    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // Payment method
    if (paymentMethod !== "razorpay") {
      alert("Please select a payment method.");
      return;
    }

    // =================================================
    // USER ID
    // =================================================

    const userId = user?._id || user?.id;

    if (!userId) {
      alert(
        "User information not found. Please login again."
      );

      navigate("/login");

      return;
    }

    // =================================================
    // RAZORPAY KEY
    // =================================================

    if (!RAZORPAY_KEY_ID) {
      console.error(
        "VITE_RAZORPAY_KEY_ID is missing."
      );

      alert(
        "Razorpay Key ID is missing. Please check your frontend .env file."
      );

      return;
    }

    try {
      setPaymentLoading(true);

      // =================================================
      // LOAD RAZORPAY SCRIPT
      // =================================================

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert(
          "Unable to load Razorpay. Please check your internet connection."
        );

        setPaymentLoading(false);

        return;
      }

      // =================================================
      // ORDER DATA
      // =================================================

      const orderData = {
        userId,

        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },

        location: location
          ? {
              latitude: location[0],
              longitude: location[1],
            }
          : null,

        items: cart.map((item) => ({
          pizzaId: item._id,
          name: item.name,
          quantity: Number(item.quantity || 1),
          price: getPrice(item),
          size: item.selectedSize?.size || null,
        })),

        subtotal,
        deliveryFee,
        discount,
        total,

        paymentMethod: "razorpay",
      };

      console.log("Order Data:", orderData);

      // =================================================
      // CREATE RAZORPAY ORDER
      // =================================================

      const response = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          amount: total,
        }
      );

      console.log(
        "Razorpay Create Order Response:",
        response.data
      );

      const razorpayOrder = response.data?.order;

      if (!razorpayOrder?.id) {
        throw new Error(
          "Razorpay order was not created."
        );
      }

      // =================================================
      // RAZORPAY KEY
      // =================================================

      const keyId =
        response.data?.keyId || RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error(
          "Razorpay Key ID is missing."
        );
      }

      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {
        key: keyId,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency || "INR",

        name: "Pizza Palace",

        description: "Pizza Palace Food Order",

        order_id: razorpayOrder.id,

        prefill: {
          name: formData.name,

          contact: formData.phone,
        },

        notes: {
          address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        },

        theme: {
          color: "#f97316",
        },

        modal: {
          confirm_close: true,

          ondismiss: () => {
            console.log(
              "Razorpay checkout closed."
            );

            setPaymentLoading(false);
          },
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async (paymentResponse) => {
          console.log(
            "Payment Response:",
            paymentResponse
          );

          try {
            // =========================================
            // VERIFY PAYMENT
            // =========================================

            const verifyResponse = await axios.post(
              `${API_URL}/payment/verify`,
              paymentResponse
            );

            console.log(
              "Payment Verification:",
              verifyResponse.data
            );

            if (!verifyResponse.data?.success) {
              throw new Error(
                "Payment verification failed."
              );
            }

            // =========================================
            // SAVE ORDER
            // =========================================

            const savedOrderResponse =
              await axios.post(
                `${API_URL}/orders`,
                {
                  ...orderData,

                  paymentStatus: "Paid",

                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id,
                }
              );

            console.log(
              "Saved Order:",
              savedOrderResponse.data
            );

            if (!savedOrderResponse.data?.success) {
              throw new Error(
                savedOrderResponse.data?.message ||
                  "Order could not be saved."
              );
            }

            // =========================================
            // SUCCESS
            // =========================================

            alert(
              "Payment successful! Your order has been placed."
            );

            setPaymentLoading(false);

            // IMPORTANT:
            // App.jsx has /orders
            // NOT /my-orders

            navigate("/orders");

          } catch (error) {
            console.error(
              "Payment verification/order error:",
              error
            );

            const message =
              error.response?.data?.message ||
              error.message ||
              "Something went wrong after payment.";

            alert(message);

            setPaymentLoading(false);
          }
        },
      };

      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      const razorpay = new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setPaymentLoading(false);
        }
      );

      // =================================================
      // OPEN RAZORPAY
      // =================================================

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while starting payment.";

      alert(message);

      setPaymentLoading(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5ef]">

        <nav className="bg-[#111111] px-5 py-4 text-white shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between">

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-600">
                <Utensils size={19} />
              </div>

              <h1 className="text-xl font-black">
                Pizza
                <span className="text-orange-500">
                  Palace
                </span>
              </h1>
            </Link>

            <Link
              to="/menu"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold transition hover:bg-orange-600"
            >
              Browse Menu
            </Link>

          </div>
        </nav>

        <div className="flex min-h-[75vh] items-center justify-center px-5">

          <div className="w-full max-w-lg rounded-[2rem] border border-[#ebe3d9] bg-white px-8 py-14 text-center shadow-xl">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <ShoppingBag
                size={42}
                className="text-orange-500"
              />
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.25em] text-orange-500">
              Pizza Palace
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Add some delicious pizzas
              before continuing to checkout.
            </p>

            <Link
              to="/menu"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#151515] px-7 py-3 font-bold text-white transition hover:bg-orange-500"
            >
              Explore Menu
              <ChevronRight size={18} />
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111] text-white shadow-lg">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
              <Utensils
                size={20}
                strokeWidth={2.5}
              />
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

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 sm:text-sm">

            <Lock
              size={16}
              className="text-green-400"
            />

            Secure Checkout

          </div>

        </div>

      </nav>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">

        {/* HEADER */}

        <div className="mb-10">

          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                Final Step
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-tight text-[#151515] sm:text-5xl">
                Checkout
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Complete your details,
                choose your preferred payment
                method and place your order.
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#e9dfd3] bg-white px-4 py-3 shadow-sm">

              <ShoppingBag
                size={19}
                className="text-orange-500"
              />

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Your order
                </p>

                <p className="text-sm font-black text-gray-900">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "Item"
                    : "Items"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* DELIVERY DETAILS */}

            <section className="overflow-hidden rounded-3xl border border-[#ebe3d9] bg-white shadow-sm">

              <div className="border-b border-gray-100 px-6 py-6 sm:px-8">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                    <MapPin
                      size={21}
                      className="text-orange-500"
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-black text-gray-900">
                      Delivery Details
                    </h3>

                    <p className="text-xs text-gray-400">
                      Where should we deliver your pizza?
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-5 px-6 py-7 sm:px-8">

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                        errors.name
                          ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"
                      }`}
                    />

                  </div>

                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                        errors.phone
                          ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"
                      }`}
                    />

                  </div>

                  {errors.phone && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* ADDRESS */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House no, street, landmark..."
                    className={`w-full resize-none rounded-xl border bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                      errors.address
                        ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                        : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"
                    }`}
                  />

                  {errors.address && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.address}
                    </p>
                  )}

                </div>

                {/* CITY + PINCODE */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                        errors.city
                          ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"
                      }`}
                    />

                    {errors.city && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.city}
                      </p>
                    )}

                  </div>

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      inputMode="numeric"
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                        errors.pincode
                          ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                          : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"
                      }`}
                    />

                    {errors.pincode && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.pincode}
                      </p>
                    )}

                  </div>

                </div>

                {/* LOCATION */}

                <div className="border-t border-gray-100 pt-6">

                  <div className="mb-4">

                    <h4 className="flex items-center gap-2 text-sm font-black text-gray-900">

                      <MapPin
                        size={17}
                        className="text-orange-500"
                      />

                      Pin Your Location

                    </h4>

                    <p className="mt-1 text-xs text-gray-400">
                      Optional — use the map for
                      accurate delivery.
                    </p>

                  </div>

                  <LocationPicker
                    position={location}
                    setPosition={setLocation}
                  />

                  {location ? (
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3">

                      <CheckCircle2
                        size={18}
                        className="text-green-500"
                      />

                      <div>

                        <p className="text-xs font-bold text-green-700">
                          Location selected
                        </p>

                        <p className="mt-0.5 text-[10px] text-green-600">
                          Map location included
                          with your order.
                        </p>

                      </div>

                    </div>
                  ) : (
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">

                      <Home
                        size={18}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />

                      <div>

                        <p className="text-xs font-bold text-gray-600">
                          Address delivery selected
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
                          Your typed address
                          will be used.
                        </p>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-[#ebe3d9] bg-white shadow-sm">

              <div className="border-b border-gray-100 px-6 py-6 sm:px-8">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                    <CreditCard
                      size={21}
                      className="text-orange-500"
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-black text-gray-900">
                      Payment Method
                    </h3>

                    <p className="text-xs text-gray-400">
                      Pay securely with Razorpay.
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6 sm:p-8">

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("razorpay")
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition ${
                    paymentMethod === "razorpay"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <CreditCard size={20} />
                    </div>

                    <div>

                      <p className="text-sm font-black text-gray-900">
                        Online Payment
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        UPI, Cards, Net Banking & more
                      </p>

                    </div>

                  </div>

                  <CheckCircle2
                    size={21}
                    className="text-orange-500"
                  />

                </button>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-4">

                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-green-500"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Your payment is processed securely
                    through Razorpay. Your card or UPI
                    details are not stored by Pizza Palace.
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">

            <div className="overflow-hidden rounded-3xl bg-[#151515] text-white shadow-xl">

              {/* SUMMARY HEADER */}

              <div className="border-b border-white/10 px-6 py-6">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                  Your Order
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  Order Summary
                </h3>

              </div>

              <div className="px-6 py-6">

                {/* ITEMS */}

                <div className="max-h-64 space-y-4 overflow-y-auto pr-1">

                  {cart.map((item) => {
                    const price = getPrice(item);

                    return (
                      <div
                        key={item._id}
                        className="flex gap-3"
                      >

                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-800">

                          <img
                            src={
                              item.image ||
                              "/pizza1.webp"
                            }
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/pizza1.webp";
                            }}
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-bold">
                            {item.name}
                          </p>

                          {item.selectedSize && (
                            <p className="mt-1 text-[10px] text-gray-500">
                              Size:{" "}
                              {
                                item.selectedSize.size
                              }
                            </p>
                          )}

                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>

                        </div>

                        <p className="text-sm font-bold">
                          ₹
                          {price *
                            Number(
                              item.quantity || 1
                            )}
                        </p>

                      </div>
                    );
                  })}

                </div>

                {/* COUPON */}

                <div className="my-6 border-t border-white/10 pt-6">

                  <p className="mb-3 flex items-center gap-2 text-xs font-bold text-gray-400">

                    <Tag size={15} />

                    Have a coupon?

                  </p>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) =>
                        setCoupon(e.target.value)
                      }
                      placeholder="PIZZA100"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-white outline-none placeholder:text-gray-600 focus:border-orange-500"
                    />

                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="rounded-xl bg-white px-4 text-xs font-black text-gray-900 transition hover:bg-orange-500 hover:text-white"
                    >
                      Apply
                    </button>

                  </div>

                  {couponApplied && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-green-400">

                      <CheckCircle2 size={13} />

                      ₹100 discount applied

                    </p>
                  )}

                </div>

                {/* PRICE */}

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between text-gray-400">

                    <span>Subtotal</span>

                    <span className="font-semibold text-white">
                      ₹{subtotal}
                    </span>

                  </div>

                  <div className="flex justify-between text-gray-400">

                    <span>Delivery</span>

                    <span
                      className={
                        deliveryFee === 0
                          ? "font-bold text-green-400"
                          : "text-white"
                      }
                    >
                      {deliveryFee === 0
                        ? "FREE"
                        : `₹${deliveryFee}`}
                    </span>

                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-gray-400">

                      <span>Discount</span>

                      <span className="font-bold text-green-400">
                        -₹{discount}
                      </span>

                    </div>
                  )}

                </div>

                <div className="my-6 border-t border-white/10" />

                {/* TOTAL */}

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Payable Amount
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      ₹{total}
                    </p>

                  </div>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                    SECURE
                  </span>

                </div>

                {/* PAYMENT BUTTON */}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-sm font-black shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {paymentLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={17} />

                      Pay ₹{total}

                      <ChevronRight size={19} />
                    </>
                  )}

                </button>

                <p className="mt-4 text-center text-[10px] leading-4 text-gray-600">
                  By placing your order, you agree
                  to Pizza Palace's terms and
                  conditions.
                </p>

              </div>

            </div>

            {/* DELIVERY INFO */}

            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-[#ebe3d9] bg-white p-4 shadow-sm">

                <Truck
                  size={19}
                  className="text-orange-500"
                />

                <p className="mt-3 text-xs font-black text-gray-800">
                  Fast Delivery
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Hot at your door
                </p>

              </div>

              <div className="rounded-2xl border border-[#ebe3d9] bg-white p-4 shadow-sm">

                <Clock3
                  size={19}
                  className="text-orange-500"
                />

                <p className="mt-3 text-xs font-black text-gray-800">
                  30–40 min
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Estimated time
                </p>

              </div>

            </div>

            <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-[#ebe3d9] bg-white p-4">

              <ShieldCheck
                size={18}
                className="text-green-500"
              />

              <p className="text-[11px] font-semibold text-gray-500">
                Safe & secure checkout
              </p>

            </div>

          </aside>

        </div>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="mt-10 bg-[#111111] px-5 py-10 text-center">

        <div className="flex items-center justify-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">

            <Utensils
              size={15}
              className="text-white"
            />

          </div>

          <p className="text-lg font-black text-white">
            Pizza
            <span className="text-orange-500">
              Palace
            </span>
          </p>

        </div>

        <p className="mt-2 text-xs text-gray-600">
          Freshly baked. Deliciously delivered.
        </p>

        <p className="mt-5 text-[10px] text-gray-700">
          © 2026 Pizza Palace. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Checkout;