import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Utensils,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://pizza-palace-9.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert(response.data.message);

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="absolute left-0 right-0 top-0 z-50">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 shadow-lg shadow-orange-500/20">

              <Utensils
                size={20}
                className="text-white"
                strokeWidth={2.5}
              />

            </div>

            <div>

              <h1 className="text-xl font-black text-[#151515] sm:text-2xl">

                Pizza
                <span className="text-orange-500">
                  Palace
                </span>

              </h1>

              <p className="hidden text-[8px] font-bold uppercase tracking-[0.25em] text-gray-400 sm:block">
                Crafted for cravings
              </p>

            </div>

          </Link>


          {/* HOME BUTTON */}

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-orange-300 hover:text-orange-500"
          >

            <ArrowLeft size={15} />

            Back Home

          </Link>

        </div>

      </nav>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="grid min-h-screen lg:grid-cols-2">


        {/* =====================================================
            LEFT PREMIUM SECTION
        ===================================================== */}

        <div className="relative hidden overflow-hidden bg-[#151515] lg:block">

          {/* Background decoration */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />


          {/* Content */}

          <div className="relative flex h-full items-center justify-center px-12">

            <div className="max-w-xl">


              {/* Badge */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2">

                <Sparkles
                  size={14}
                  className="text-orange-400"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                  Join Pizza Palace
                </span>

              </div>


              {/* Heading */}

              <h2 className="text-5xl font-black leading-tight text-white xl:text-6xl">

                Your next
                <br />

                <span className="text-orange-500">
                  favorite
                </span>

                <br />

                meal starts here.

              </h2>


              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">

                Create your Pizza Palace account and
                enjoy a faster, easier and more delicious
                way to order your favorite pizzas.

              </p>


              {/* FEATURES */}

              <div className="mt-10 space-y-4">


                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">

                    <CheckCircle2
                      size={19}
                      className="text-orange-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-black text-white">
                      Easy Ordering
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Order your favorite pizzas in seconds.
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">

                    <CheckCircle2
                      size={19}
                      className="text-orange-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-black text-white">
                      Track Your Orders
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Keep track of every delicious order.
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">

                    <CheckCircle2
                      size={19}
                      className="text-orange-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-black text-white">
                      Secure Payments
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Safe and secure online checkout.
                    </p>

                  </div>

                </div>

              </div>


              {/* QUOTE */}

              <div className="mt-10 border-l-2 border-orange-500 pl-5">

                <p className="text-sm italic text-gray-400">
                  "Good food. Good mood. Great pizza."
                </p>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Pizza Palace
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT REGISTER SECTION
        ===================================================== */}

        <div className="flex min-h-screen items-center justify-center px-5 py-28 sm:px-8 lg:py-20">

          <div className="w-full max-w-md">


            {/* MOBILE LOGO */}

            <div className="mb-8 text-center lg:hidden">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 shadow-xl shadow-orange-500/20">

                <Utensils
                  size={27}
                  className="text-white"
                />

              </div>

            </div>


            {/* HEADER */}

            <div className="mb-8">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                Pizza Palace
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-[#151515] sm:text-5xl">

                Create
                <br />

                <span className="text-orange-500">
                  Account.
                </span>

              </h1>

              <p className="mt-4 text-sm leading-6 text-gray-500">

                Join Pizza Palace and start ordering
                freshly baked pizzas today.

              </p>

            </div>


            {/* =================================================
                REGISTER CARD
            ================================================= */}

            <div className="rounded-[2rem] border border-[#ebe3d9] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">

              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >


                {/* NAME */}

                <div>

                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-orange-500"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>


                  {/* PASSWORD INFO */}

                  <p className="mt-2 text-[10px] text-gray-400">
                    Password must contain at least 6 characters.
                  </p>

                </div>


                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create My Account

                      <ChevronRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>


              {/* SECURITY */}

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3">

                <ShieldCheck
                  size={16}
                  className="text-green-500"
                />

                <p className="text-[10px] font-semibold text-gray-500">
                  Your personal information is securely
                  protected.
                </p>

              </div>

            </div>


            {/* LOGIN */}

            <p className="mt-7 text-center text-sm text-gray-500">

              Already have an account?

              {" "}

              <Link
                to="/login"
                className="font-black text-orange-500 transition hover:text-orange-600"
              >
                Login
              </Link>

            </p>


            {/* FOOTER */}

            <p className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-gray-400">
              Freshly baked · Deliciously delivered
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Register;