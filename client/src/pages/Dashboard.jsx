import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import {
  getFinancialSummary,
} from "../services/analyticsService";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Target,
  Bot,
  BarChart3,
  Receipt,
  ArrowRight,
  Sparkles,
  Activity,
  ShieldCheck,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const fetchSummary =
    async () => {
      try {
        setLoading(true);

        const data =
          await getFinancialSummary();

        setSummary(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSummary();
  }, []);

  const savingsRate =
    Number(summary.totalIncome) > 0
      ? (
          (Number(summary.balance) /
            Number(summary.totalIncome)) *
          100
        ).toFixed(1)
      : 0;

  const netFlow =
    Number(summary.totalIncome) -
    Number(summary.totalExpenses);

  const stats = [
    {
      title: "Total Balance",
      value: `RM ${summary.balance}`,
      subtitle: "Current financial position",
      icon: <Wallet size={22} />,
      color: "text-blue-400",
      border: "hover:border-blue-500/30",
    },
    {
      title: "Total Income",
      value: `RM ${summary.totalIncome}`,
      subtitle: "Money coming in",
      icon: <TrendingUp size={22} />,
      color: "text-green-400",
      border: "hover:border-green-500/30",
    },
    {
      title: "Total Expenses",
      value: `RM ${summary.totalExpenses}`,
      subtitle: "Money going out",
      icon: <TrendingDown size={22} />,
      color: "text-red-400",
      border: "hover:border-red-500/30",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      subtitle: "Income kept after expenses",
      icon: <Target size={22} />,
      color: "text-purple-400",
      border: "hover:border-purple-500/30",
    },
  ];

  const actions = [
    {
      title: "Add Transaction",
      text: "Record income or expenses.",
      icon: <Plus size={22} />,
      path: "/transactions",
    },
    {
      title: "Ask Vayqor",
      text: "Get AI financial guidance.",
      icon: <Bot size={22} />,
      path: "/assistant",
    },
    {
      title: "Scan Receipt",
      text: "Extract receipt details with AI.",
      icon: <Receipt size={22} />,
      path: "/receipt-scanner",
    },
    {
      title: "View Analytics",
      text: "Understand spending trends.",
      icon: <BarChart3 size={22} />,
      path: "/analytics",
    },
  ];

  return (
    <MainLayout>
      <div className="w-full space-y-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-blue-400 font-semibold mb-2">
              Welcome back 👋
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Financial Dashboard
            </h1>

            <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
              Monitor your finances, analyze trends, and make smarter decisions
              with AI-powered insights.
            </p>
          </div>

          <button
            onClick={() => navigate("/transactions")}
            className="w-full sm:w-fit bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
          >
            + Add Transaction
          </button>
        </div>

        {!loading &&
        Number(summary.totalIncome) === 0 &&
        Number(summary.totalExpenses) === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 sm:p-10 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mb-5">
              <Wallet size={30} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Start Your Financial Journey
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
              Add your first income or expense to unlock analytics,
              AI guidance, forecasting, savings tracking, and reports.
            </p>

            <button
              onClick={() => navigate("/transactions")}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Add First Transaction
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className={`bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900 hover:-translate-y-1 ${stat.border} transition duration-300`}
              >
                <div className={`${stat.color} mb-5`}>
                  {stat.icon}
                </div>

                <p className="text-zinc-400 text-sm mb-2">
                  {stat.title}
                </p>

                {loading ? (
                  <div className="h-9 w-36 bg-zinc-800 rounded animate-pulse" />
                ) : (
                  <h2 className="text-3xl font-extrabold">
                    {stat.value}
                  </h2>
                )}

                <p className="text-zinc-500 text-sm mt-3">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-blue-500/30 transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                <Activity size={24} />
              </div>

              <div>
                <p className="text-blue-400 font-semibold">
                  Financial Health Snapshot
                </p>
                <p className="text-zinc-500 text-sm">
                  A quick view of your money position.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm mb-2">
                  Net Flow
                </p>

                <h3
                  className={`text-2xl font-extrabold ${
                    netFlow >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  RM {netFlow}
                </h3>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm mb-2">
                  Savings Strength
                </p>

                <h3 className="text-2xl font-extrabold text-purple-400">
                  {Number(savingsRate) >= 30
                    ? "Strong"
                    : Number(savingsRate) >= 10
                    ? "Stable"
                    : "Needs Focus"}
                </h3>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-sm mb-2">
                  AI Readiness
                </p>

                <h3 className="text-2xl font-extrabold text-blue-400">
                  Ready
                </h3>
              </div>
            </div>

            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
              <p className="text-blue-300 font-semibold mb-2">
                Vayqor Insight
              </p>

              <p className="text-zinc-300 leading-relaxed">
                {Number(summary.totalExpenses) > Number(summary.totalIncome)
                  ? "Your expenses are currently higher than your income. Start by reviewing your biggest spending categories."
                  : "Your income is currently ahead of your expenses. Keep tracking your habits and use analytics to improve your savings rate."}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 sm:p-8 rounded-3xl">
            <Sparkles className="text-blue-400 mb-4" size={28} />

            <p className="text-blue-400 font-semibold mb-3">
              AI Finance Analyst
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Let Vayqor analyze your money.
            </h2>

            <p className="text-zinc-400 leading-relaxed mb-6">
              Ask for spending reviews, budgeting advice, savings strategies,
              and financial recommendations based on your data.
            </p>

            <button
              onClick={() => navigate("/assistant")}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Ask Vayqor
              <ArrowRight size={18} />
            </button>
          </div>

        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                Quick Actions
              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                Move faster across your financial workspace.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {actions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-left hover:bg-zinc-800 hover:-translate-y-1 hover:border-blue-500/30 transition duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition">
                  {action.icon}
                </div>

                <h3 className="text-lg font-bold mb-2">
                  {action.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {action.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-green-500/30 transition">
            <ShieldCheck className="text-green-400 mb-4" size={28} />

            <p className="text-green-400 font-semibold mb-3">
              Financial System
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Your core tools are connected.
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p>✅ Track daily transactions</p>
              <p>✅ Monitor income and expenses</p>
              <p>✅ Analyze monthly financial trends</p>
              <p>✅ Generate AI-powered insights</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-purple-500/30 transition">
            <Target className="text-purple-400 mb-4" size={28} />

            <p className="text-purple-400 font-semibold mb-3">
              Next Best Step
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Improve your financial clarity.
            </h2>

            <p className="text-zinc-400 leading-relaxed mb-6">
              Review your analytics dashboard to understand where your money
              is going and what patterns Vayqor can detect.
            </p>

            <button
              onClick={() => navigate("/analytics")}
              className="inline-flex items-center gap-2 bg-zinc-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-700 transition"
            >
              View Analytics
              <ArrowRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;