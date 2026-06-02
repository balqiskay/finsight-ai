import { useState } from "react";
import toast from "react-hot-toast";

function Pricing() {
  const [loadingPlan, setLoadingPlan] =
    useState(null);

  const plans = [
    {
      id: 1,
      name: "Free",
      price: "$0",
      description: "For users who want to start managing their finances.",
      features: [
        "Expense tracking",
        "Savings goals",
        "Recurring transactions",
        "Basic analytics",
        "50 AI messages per month",
      ],
      button: "Switch to Free",
      highlighted: false,
    },
    {
      id: 2,
      name: "Pro",
      price: "$9",
      description: "For users who want deeper insights and AI assistance.",
      features: [
        "Unlimited AI assistant",
        "Receipt scanner",
        "Advanced analytics",
        "AI spending insights",
        "Priority support",
      ],
      button: "Test",
      highlighted: true,
    },
    {
      id: 3,
      name: "Premium",
      price: "$19",
      description: "For power users who want full financial intelligence.",
      features: [
        "Everything in Pro",
        "Advanced financial reports",
        "Future financial forecasting",
        "Early access features",
        "Premium support",
      ],
      button: "Upgrade to Premium",
      highlighted: false,
    },
  ];

  const handleUpgrade =
  async (planId, planName) => {
    try {
      setLoadingPlan(planId);

      const token =
        localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Please log in first."
        );
        return;
      }

      if (planName === "Free") {
        toast.error(
          "Free plan downgrade will be handled later."
        );
        return;
      }

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/subscriptions/create-checkout-session`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              plan: planName,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
          "Failed to start checkout."
        );
        return;
      }

      window.location.href =
        data.url;

    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong."
      );

    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 md:px-16 py-16">

      <div className="max-w-6xl mx-auto text-center">

        <p className="text-blue-400 font-semibold mb-3">
          Pricing
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Choose your Vayqor plan
        </h1>

        <p className="text-zinc-400 max-w-2xl mx-auto mb-14">
          Start for free and upgrade when you need more AI-powered financial
          intelligence, automation, and advanced insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 text-left ${
                plan.highlighted
                  ? "border-blue-500 bg-blue-500/10 shadow-2xl shadow-blue-500/10"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              {plan.highlighted && (
                <p className="text-blue-400 text-sm font-semibold mb-4">
                  Recommended
                </p>
              )}

              <h2 className="text-2xl font-bold mb-2">
                {plan.name}
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold">
                  {plan.price}
                </span>
                <span className="text-zinc-400">
                  /month
                </span>
              </div>

              <button
                onClick={() =>
                  handleUpgrade(
                    plan.id,
                    plan.name
                  )
                }
                disabled={loadingPlan === plan.id}
                className={`w-full py-3 rounded-xl font-semibold mb-8 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-white text-black hover:scale-[1.02]"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {loadingPlan === plan.id
                  ? "Updating..."
                  : plan.button}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-zinc-300 text-sm"
                  >
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Pricing;