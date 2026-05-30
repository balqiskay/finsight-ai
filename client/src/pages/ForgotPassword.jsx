import { useState } from "react";
import toast from "react-hot-toast";

import {
  forgotPassword,
} from "../services/authService";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const data =
          await forgotPassword(email);

        toast.success(
          data.message
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);

      }

    };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold mb-4">
          Forgot Password
        </h1>

        <p className="text-zinc-400 mb-8">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-6 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-4 rounded-xl font-semibold"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

      </div>

    </div>
  );

}

export default ForgotPassword;