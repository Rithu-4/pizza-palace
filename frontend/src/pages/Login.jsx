import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(data);

      // Store token
      localStorage.setItem("token", data.token);

      // Store user
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful 🔥");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Invalid Credentials"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-lg w-100"
      >
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">
          Login 🍕
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-5 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-5 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
        >
          Login
        </button>

        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;