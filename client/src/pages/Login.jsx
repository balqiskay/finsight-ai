import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

    if (
      !formData.email ||
      !formData.password
    ) {
      toast.error(
        "Please fill in all fields"
      )
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      toast.success("Login successful");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">

        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950">

          <div>
            <h1 className="text-5xl font-bold mb-6">
              FinSight AI
            </h1>

            <p className="text-zinc-300 text-lg leading-relaxed">
              Your intelligent financial dashboard for tracking transactions,
              understanding spending habits, and generating AI-powered money insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-10">
            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="font-bold mb-1">
                AI Financial Score
              </h3>
              <p className="text-sm text-zinc-300">
                Get smart evaluations of your financial health.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="font-bold mb-1">
                Smart Analytics
              </h3>
              <p className="text-sm text-zinc-300">
                Visualize income, expenses, categories, and trends.
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="font-bold mb-1">
                PDF Reports
              </h3>
              <p className="text-sm text-zinc-300">
                Export clean financial reports anytime.
              </p>
            </div>
          </div>

        </div>

        <div className="p-8 md:p-12">
          <div className="md:hidden mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-6 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
          
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <p className="text-sm text-blue-100 mb-2">
                Welcome to
              </p>

              <h1 className="text-4xl font-extrabold mb-3">
                FinSight AI
              </h1>

              <p className="text-blue-100 text-sm leading-relaxed">
                Track money, analyze spending, generate AI insights, and export smart financial reports.
              </p>
            </div>

          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">
              Welcome back
            </h2>

            <p className="text-zinc-400">
              Login to continue managing your finances.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

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

            <div className="flex justify-end mb-6">
              
              <a
               href="/forgot-password"
               className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Forgot Password?
              </a>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black p-4 rounded-xl font-semibold disabled:opacity-50 transition duration-300 hover:scale-[1.02]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-zinc-400 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;