import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = await loginUser(formData);

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      alert("Login failed");

    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >

        <h1 className="text-white text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-6"
        />

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded-lg font-semibold"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;