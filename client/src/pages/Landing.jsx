import { Link } from "react-router-dom";
import {
  Brain,
  BarChart3,
  Wallet,
  Target,
  Repeat,
  FileText,
} from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <nav className="flex items-center justify-between px-6 md:px-16 py-6">
        <h1 className="text-2xl font-bold">
          Vayqor

          The AI Financial Operating System.
        </h1>

        <div className="flex items-center gap-4">
          
          <Link
           to="/pricing"
           className="text-zinc-300 hover:text-white font-medium transition"
          >
            Pricing
          </Link>

          <Link
           to="/login"
           className="text-zinc-300 hover:text-white font-medium transition"
          >
            Login
          </Link>

          <Link
           to="/register"
           className="bg-white text-black px-5 py-2 rounded-xl font-semibold"
          >
            Get Started
          </Link>

        </div>
      </nav>

      <section className="px-6 md:px-16 py-20 text-center">
        <div className="max-w-5xl mx-auto">

          <p className="text-blue-400 font-semibold mb-4">
            AI-Powered Personal Finance Platform
          </p>

          <h2 className="text-4xl md:text-7xl font-extrabold leading-tight mb-6">
            Understand your money.
            <br />
            Grow smarter financially.
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
            Track transactions, analyze spending, detect overspending,
            forecast your financial future, and get AI-powered money insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold transition hover:scale-[1.02]"
            >
              Start Free
            </Link>

            <Link
              to="/pricing"
              className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-2xl font-bold transition hover:bg-zinc-800"
            >
              View Pricing
            </Link>
          </div>

        </div>
      </section>

      <section className="px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {[
            {
              icon: <Wallet />,
              title: "Track Transactions",
              text: "Manage income and expenses with a clean, responsive interface.",
            },
            {
              icon: <BarChart3 />,
              title: "Advanced Analytics",
              text: "Visualize trends, expense ratios, savings rates, and top spending categories.",
            },
            {
              icon: <Brain />,
              title: "AI Financial Insights",
              text: "Generate personalized financial recommendations powered by AI.",
            },
            {
              icon: <Target />,
              title: "Savings Goals",
              text: "Set financial goals and track progress with smart visual indicators.",
            },
            {
              icon: <Repeat />,
              title: "Recurring Transactions",
              text: "Plan repeated expenses and income like salaries, rent, and subscriptions.",
            },
            {
              icon: <FileText />,
              title: "PDF Reports",
              text: "Export professional financial reports whenever you need them.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800"
            >
              <div className="text-blue-400 mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-2">
                {feature.title}
              </h3>

              <p className="text-zinc-400">
                {feature.text}
              </p>
            </div>
          ))}

        </div>
      </section>

      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 rounded-[2rem] p-8 md:p-14 text-center shadow-[0_0_80px_rgba(59,130,246,0.35)]">

          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Your AI finance command center.
          </h2>

          <p className="text-blue-100 max-w-3xl mx-auto text-lg mb-8">
            From daily spending to future forecasting, Vayqor helps you
            understand where your money goes and how to improve your financial health.
          </p>

          <Link
            to="/register"
            className="inline-block bg-white text-black px-8 py-4 rounded-2xl font-bold transition hover:scale-[1.02]"
          >
            Create Your Free Account
          </Link>

        </div>
      </section>

      <footer className="px-6 md:px-16 py-10 border-t border-zinc-800 text-center">
        
        <h3 className="text-white font-semibold text-lg">
          Vayqor
        </h3>

        <p className="text-zinc-400 mt-2">
          AI-Powered Financial Intelligence.
        </p>

        <p className="text-zinc-500 text-sm mt-6">
          © 2026 Vayqor · A Kayvian Company
        </p>

        <p className="mt-3">
          <a
           href="mailto:hello@kayvian.com"
           className="text-zinc-500 text-sm hover:text-white transition"
          >
            hello@kayvian.com
          </a>
        </p>

        <div className="mt-4 flex justify-center gap-6 text-sm text-zinc-500">
          <a
          href="/privacy"
          className="hover:text-white transition"
          >
            Privacy Policy
          </a>

          <a
           href="/terms"
           className="hover:text-white transition"
          >
            Terms of Service
          </a>
        </div>

      </footer>

    </div>
  );
}

export default Landing;