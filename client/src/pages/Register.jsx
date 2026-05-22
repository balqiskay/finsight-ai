import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await registerUser(formData);

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">

        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-950 via-zinc-950 to-zinc-900">

          <div>
            <h1 className="text-5xl font-bold mb-6">
              Start with FinSight AI
            </h1>

            <p className="text-zinc-300 text-lg leading-relaxed">
              Create your account and start tracking your money with AI-powered
              insights, smart analytics, and financial reports.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-10">

            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="font-bold mb-1">
                Track Every Transaction
              </h3>
              <p className="text-sm text-zinc-300">
                Record income and expenses in one clean dashboard.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="font-bold mb-1">
                Understand Spending
              </h3>
              <p className="text-sm text-zinc-300">
                View categories, monthly trends, and visual analytics.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="font-bold mb-1">
                AI-Powered Advice
              </h3>
              <p className="text-sm text-zinc-300">
                Generate financial health scores and practical recommendations.
              </p>
            </div>

          </div>

        </div>

        <div className="p-8 md:p-12">

          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">
              Create account
            </h2>

            <p className="text-zinc-400">
              Sign up to start your financial journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black p-4 rounded-xl font-semibold disabled:opacity-50 transition duration-300 hover:scale-[1.02]"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <p className="text-zinc-400 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;