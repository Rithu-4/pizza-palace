import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Utensils,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://pizza-palace-9.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful 🔥");

      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Invalid Credentials"
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

          {/* BACK HOME */}

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
            LEFT VISUAL SECTION
        ===================================================== */}

        <div className="relative hidden overflow-hidden bg-[#151515] lg:block">

          {/* Background decoration */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />


          {/* Main content */}

          <div className="relative flex h-full items-center justify-center px-12">

            <div className="max-w-xl">

              {/* Small badge */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2">
                <Sparkles
                  size={14}
                  className="text-orange-400"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                  Welcome Back
                </span>
              </div>


              {/* Heading */}

              <h2 className="text-5xl font-black leading-tight text-white xl:text-6xl">
                Your favorite
                <br />

                <span className="text-orange-500">
                  pizzas
                </span>

                <br />

                are waiting.
              </h2>


              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                Sign in to continue your Pizza Palace
                journey. Your favorite pizzas, orders
                and cravings are just one click away.
              </p>


              {/* Feature cards */}

              <div className="mt-10 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                    <Utensils
                      size={19}
                      className="text-orange-400"
                    />
                  </div>

                  <p className="mt-4 text-sm font-black text-white">
                    Freshly Baked
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Made fresh for every craving.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                    <ShieldCheck
                      size={19}
                      className="text-green-400"
                    />
                  </div>

                  <p className="mt-4 text-sm font-black text-white">
                    Secure Orders
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Safe and secure checkout.
                  </p>

                </div>

              </div>


              {/* Bottom quote */}

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
            RIGHT LOGIN SECTION
        ===================================================== */}

        <div className="flex min-h-screen items-center justify-center px-5 py-28 sm:px-8 lg:py-20">

          <div className="w-full max-w-md">


            {/* Mobile Logo */}

            <div className="mb-8 text-center lg:hidden">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 shadow-xl shadow-orange-500/20">

                <Utensils
                  size={27}
                  className="text-white"
                />

              </div>

            </div>


            {/* Heading */}

            <div className="mb-8">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                Pizza Palace
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-[#151515] sm:text-5xl">
                Welcome
                <br />
                <span className="text-orange-500">
                  Back.
                </span>
              </h1>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Sign in to access your account and
                continue ordering your favorite pizzas.
              </p>

            </div>


            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div className="rounded-[2rem] border border-[#ebe3d9] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >


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

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-xs font-black uppercase tracking-wide text-gray-500">
                      Password
                    </label>

                  </div>

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
                      placeholder="Enter your password"
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

                </div>


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Login to Pizza Palace

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
                  Your account information is securely
                  protected.
                </p>

              </div>

            </div>


            {/* REGISTER */}

            <p className="mt-7 text-center text-sm text-gray-500">

              Don't have an account?

              {" "}

              <Link
                to="/register"
                className="font-black text-orange-500 transition hover:text-orange-600"
              >
                Create Account
              </Link>

            </p>


            {/* Footer */}

            <p className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-gray-400">
              Freshly baked · Deliciously delivered
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;