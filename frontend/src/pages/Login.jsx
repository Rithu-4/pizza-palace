import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
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

      alert("Login Successful 🔥");

      localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);
window.location.href = "/";

    } catch (error) {

      console.log(error);

      alert("Invalid Credentials");

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

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-5 outline-none"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-5 outline-none"
        />

        {/* Button */}
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