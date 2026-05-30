import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  resetPassword,
} from "../services/authService";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
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

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (password !== confirmPassword) {
        toast.error(
          "Passwords do not match"
        );
        return;
      }

      try {

        setLoading(true);

        const data =
          await resetPassword(
            token,
            password
          );

        toast.success(
          data.message
        );

        navigate("/login");

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Reset failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold mb-4">
          Reset Password
        </h1>

        <p className="text-zinc-400 mb-8">
          Enter your new password.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-4 outline-none"
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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-zinc-800 text-white mb-6 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-4 rounded-xl font-semibold"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );

}

export default ResetPassword;