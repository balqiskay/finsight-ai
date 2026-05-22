import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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

      await registerUser(formData);

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert("Registration failed");

    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >

        <h1 className="text-white text-3xl font-bold mb-6">
          Register
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4"
        />

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
          className="w-full bg-white text-black p-3 rounded-lg font-semibold transition duration-300 hover:scale-[1.02]"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;