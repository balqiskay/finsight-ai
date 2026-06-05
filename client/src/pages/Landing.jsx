import { Link } from "react-router-dom";
import {
  Brain,
  BarChart3,
  Wallet,
  Target,
  Repeat,
  FileText,
  Sparkles,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

function Landing() {
  const features = [
    {
      icon: <Wallet size={24} />,
      title: "Smart Expense Tracking",
      text: "Track income, expenses, categories, and recurring transactions in one clean workspace.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Financial Analytics",
      text: "Understand your spending patterns with visual breakdowns, trends, and summaries.",
    },
    {
      icon: <Brain size={24} />,
      title: "AI Money Insights",
      text: "Get AI-powered financial guidance based on your actual activity and habits.",
    },
    {
      icon: <Target size={24} />,
      title: "Savings Goals",
      text: "Set goals, track progress, and stay motivated with smart visual indicators.",
    },
    {
      icon: <Repeat size={24} />,
      title: "Recurring Transactions",
      text: "Plan repeated expenses and income like rent, subscriptions, bills, and salary.",
    },
    {
      icon: <FileText size={24} />,
      title: "Premium Reports",
      text: "Export polished financial reports and unlock forecasting with Premium.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-160px] right-[-120px] w-[420px] h-[420px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Vayqor
            </span>
            <span className="hidden sm:block text-xs text-zinc-500">
              AI Financial Operating System
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5 text-sm">
            <Link
              to="/pricing"
              className="text-zinc-300 hover:text-white transition"
            >
              Pricing
            </Link>

            <Link
              to="/login"
              className="text-zinc-300 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white text-black px-4 sm:px-5 py-2 rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              Get Started
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 text-center">
        <div className="max-w-6xl mx-auto">

          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            AI-powered personal finance platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-5xl mx-auto">
            Understand your money.
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Grow smarter financially.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Vayqor helps you track spending, manage goals, analyze habits,
            forecast your financial future, and unlock AI-powered money insights.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-black px-7 py-4 rounded-2xl font-bold hover:scale-[1.02] transition text-center"
            >
              Start Free
            </Link>

            <Link
              to="/pricing"
              className="bg-zinc-900/80 border border-zinc-800 px-7 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition text-center"
            >
              View Pricing
            </Link>
          </div>

          <p className="mt-5 text-sm text-zinc-500">
            Free plan available · Upgrade anytime · Built for modern money management
          </p>

        </div>
      </section>

      {/* Preview / Trust Strip */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 text-center">
            <p className="text-3xl font-extrabold text-white">
              50
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Free AI messages/month
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 text-center">
            <p className="text-3xl font-extrabold text-white">
              3
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Flexible SaaS plans
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 text-center">
            <p className="text-3xl font-extrabold text-white">
              AI
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Insights, assistant, and forecasting
            </p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-blue-400 font-semibold mb-3">
              Everything in one financial workspace
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Built to help you see, understand, and improve your money.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-zinc-900/80 border border-zinc-800 p-6 sm:p-7 rounded-3xl hover:bg-zinc-900 hover:-translate-y-1 transition duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition">
                  {feature.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-3">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Plans Teaser */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-7 sm:p-10">
            <CreditCard className="text-blue-400 mb-5" size={30} />

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Start free. Upgrade when you need more intelligence.
            </h2>

            <p className="text-zinc-400 leading-relaxed mb-8">
              Use core tracking and basic analytics for free. Upgrade to Pro
              for AI insights and receipt scanning, or Premium for forecasting
              and advanced reports.
            </p>

            <Link
              to="/pricing"
              className="inline-block bg-white text-black px-7 py-4 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Compare Plans
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-500 text-sm mb-2">
                Free
              </p>
              <h3 className="text-2xl font-bold mb-3">
                $0/month
              </h3>
              <p className="text-zinc-400 text-sm">
                Expense tracking, savings goals, recurring transactions, basic analytics, and 50 AI messages.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-6">
              <p className="text-blue-400 text-sm mb-2">
                Recommended
              </p>
              <h3 className="text-2xl font-bold mb-3">
                Pro · $9/month
              </h3>
              <p className="text-zinc-300 text-sm">
                Unlimited AI assistant, receipt scanner, AI spending insights, and advanced analytics.
              </p>
            </div>

            <div className="sm:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6">
              <p className="text-purple-400 text-sm mb-2">
                Premium
              </p>
              <h3 className="text-2xl font-bold mb-3">
                $19/month
              </h3>
              <p className="text-zinc-400 text-sm">
                Everything in Pro, plus advanced financial reports, future forecasting, early access features, and premium support.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-12 lg:p-16 text-center shadow-[0_0_80px_rgba(59,130,246,0.28)]">

          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5">
            Your AI finance command center.
          </h2>

          <p className="text-blue-100 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            From daily spending to future forecasting, Vayqor helps you
            understand where your money goes and how to improve your financial health.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-black px-7 py-4 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Create Free Account
            </Link>

            <Link
              to="/pricing"
              className="bg-white/10 border border-white/20 text-white px-7 py-4 rounded-2xl font-bold hover:bg-white/15 transition"
            >
              View Plans
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

          <div>
            <h3 className="text-white font-bold text-lg">
              Vayqor
            </h3>

            <p className="text-zinc-500 text-sm mt-1">
              © 2026 Vayqor · A Kayvian Company
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-zinc-500">
            <a
              href="mailto:hello@kayvian.com"
              className="hover:text-white transition"
            >
              hello@kayvian.com
            </a>

            <Link
              to="/pricing"
              className="hover:text-white transition"
            >
              Pricing
            </Link>

            <a
              href="/privacy"
              className="hover:text-white transition"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-white transition"
            >
              Terms
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Landing;