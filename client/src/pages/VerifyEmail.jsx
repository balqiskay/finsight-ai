import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  verifyEmail,
} from "../services/authService";

function VerifyEmail() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [status, setStatus] =
    useState("loading");

  const hasVerified = useRef(false);

  useEffect(() => {
    
    if (hasVerified.current) return;

    hasVerified.current = true;

    const verify =
    async () => {
        
        try {
            
            await verifyEmail(token);

            setStatus("success");

        } catch (error) {
            
            console.error(error);

            setStatus("error");

        }

    };

    verify();

    }, [token]);

  if (status === "loading") {

    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Verifying email...
        </h1>
      </div>
    );

  }

  if (status === "success") {

    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

          <h1 className="text-4xl font-bold mb-4">
            Email Verified 🎉
          </h1>

          <p className="text-zinc-400 mb-8">
            Your account is now verified.
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
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

        <h1 className="text-4xl font-bold mb-4">
          Verification Failed
        </h1>

        <p className="text-zinc-400">
          Invalid or expired verification link.
        </p>

      </div>

    </div>
  );

}

export default VerifyEmail;