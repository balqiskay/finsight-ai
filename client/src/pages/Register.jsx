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
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [registrationEmail, setRegistrationEmail] = useState("");

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const strengthScore =
   Object.values(passwordChecks)
   .filter(Boolean)
   .length;

  const strengthLabel =
   strengthScore <= 2
    ? "Weak"
    : strengthScore <= 4
    ? "Medium"
    : "Strong";

  const strengthColor =
   strengthScore <= 2
    ? "text-red-400"
    : strengthScore <= 4
    ? "text-yellow-400"
    : "text-green-400";

  const strengthBarColor =
   strengthScore <= 2
    ? "bg-red-500"
    : strengthScore <= 4
    ? "bg-yellow-500"
    : "bg-green-500";

  const strengthBarWidth =
   `${(strengthScore / 5) * 100}%`;

  const handleChange = (e) => {
   setFormData({
    ...formData,
    [e.target.name]: e.target.value,
   });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      toast.error(
        "Password must include uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      setRegistrationEmail(formData.email);

      toast.success(
        "Account created. Please verify your email."
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (registrationEmail) {
    return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 max-w-lg text-center">
        
        <h1 className="text-4xl font-bold mb-4">
          Check your email
        </h1>

        <p className="text-zinc-400 mb-6">
          We sent a verification link to:
        </p>

        <p className="text-blue-400 font-semibold mb-6">
          {registrationEmail}
        </p>

        <p className="text-zinc-400 mb-8">
          Please click the verification link before logging in to your Vayqor account.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-white text-black px-8 py-4 rounded-2xl font-bold"
        >
          Go to Login
        </button>

      </div>

    </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">

        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-950 via-zinc-950 to-zinc-900">

          <div>
            <h1 className="text-5xl font-bold mb-6">
              Start with Vayqor
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
              className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mb-4">
              
              <p className={`text-sm font-semibold ${strengthColor}`}>
                Password Strength: {strengthLabel}
              </p>

              <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                
                <div
                 className={`h-full ${strengthBarColor} transition-all duration-300`}
                 style={{
                  width: strengthBarWidth,
                 }}
                />

              </div>

              <div className="text-xs mt-2 space-y-1">
                
                <p className={passwordChecks.length ? "text-green-400" : "text-zinc-500"}>
                  ✓ At least 8 characters
                </p>

                <p className={passwordChecks.uppercase ? "text-green-400" : "text-zinc-500"}>
                  ✓ Uppercase letter
                </p>

                <p className={passwordChecks.lowercase ? "text-green-400" : "text-zinc-500"}>
                  ✓ Lowercase letter
                </p>

                <p className={passwordChecks.number ? "text-green-400" : "text-zinc-500"}>
                  ✓ Number
                </p>

                <p className={passwordChecks.special ? "text-green-400" : "text-zinc-500"}>
                  ✓ Special character
                </p>

              </div>

            </div>

            <input
             type="password"
             name="confirmPassword"
             placeholder="Confirm Password"
             value={formData.confirmPassword}
             onChange={handleChange}
             className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-6 mb-2">
              <label className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                <input
                 type="checkbox"
                 id="terms"
                 required
                 className="mt-1 h-4 w-4 accent-blue-500"
                />

                <span>
                  I have read and agree to the{" "}
                  <a
                   href="/privacy"
                   target="_blank"
                   className="text-blue-400 hover:text-blue-300"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                   href="/terms"
                   target="_blank"
                   className="text-blue-400 hover:text-blue-300"
                  >
                    Terms of Service
                  </a>.
                </span>
              </label>
            </div>

            <button
             type="submit"
             disabled={loading}
             className="w-full mt-6 bg-white text-black p-4 rounded-xl font-semibold disabled:opacity-50 transition duration-300 hover:scale-[1.02]"
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