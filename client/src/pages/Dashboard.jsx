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

  const stats = [
    {
      title: "Total Balance",
      value: `RM ${summary.balance}`,
      subtitle: "Current financial position",
      icon: <Wallet size={22} />,
      color: "text-blue-400",
    },
    {
      title: "Total Income",
      value: `RM ${summary.totalIncome}`,
      subtitle: "Money coming in",
      icon: <TrendingUp size={22} />,
      color: "text-green-400",
    },
    {
      title: "Total Expenses",
      value: `RM ${summary.totalExpenses}`,
      subtitle: "Money going out",
      icon: <TrendingDown size={22} />,
      color: "text-red-400",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      subtitle: "Income kept after expenses",
      icon: <Target size={22} />,
      color: "text-purple-400",
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

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-blue-400 font-semibold mb-2">
              Welcome back 👋
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Your Financial Command Center
            </h1>

            <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
              Track your money, monitor your goals, review analytics,
              and make smarter decisions with AI-powered insights.
            </p>
          </div>

        </div>

        {/* Executive Summary */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sm:p-8 hover:border-blue-500/20 transition">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          <div>
            
            <p className="text-blue-400 font-medium mb-2">
              Financial Overview
            </p>

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              RM {summary.balance}
            </h2>

            <p className="text-zinc-400 mt-2">
              Current Available Balance
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            
            <button
             onClick={() => navigate("/transactions")}
             className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              + Add Transaction
            </button>

            <button
             onClick={() => navigate("/assistant")}
             className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Ask Vayqor
            </button>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Total Income
            </p>

            <h3 className="text-green-400 text-2xl font-bold mt-2">
              RM {summary.totalIncome}
            </h3>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Total Expenses
            </p>

            <h3 className="text-red-400 text-2xl font-bold mt-2">
              RM {summary.totalExpenses}
            </h3>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Savings Rate
            </p>

            <h3 className="text-purple-400 text-2xl font-bold mt-2">
              {savingsRate}%
            </h3>
          </div>

        </div>

        </div>

        {/* Empty State */}
        {!loading &&
        Number(summary.totalIncome) === 0 &&
        Number(summary.totalExpenses) === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 sm:p-10 text-center">
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
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900 hover:-translate-y-1 hover:border-blue-500/30 transition duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
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
          </>
        )}

        {/* Quick Actions */}
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

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-blue-500/30 transition">
            <p className="text-blue-400 font-semibold mb-3">
              AI Snapshot
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Smarter financial decisions start here.
            </h2>

            <p className="text-zinc-400 leading-relaxed mb-6">
              Ask Vayqor about your spending, savings, budgeting,
              and financial habits using your actual transaction data.
            </p>

            <button
              onClick={() => navigate("/assistant")}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Ask AI Assistant
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-purple-500/30 transition">
            <p className="text-purple-400 font-semibold mb-3">
              Financial Snapshot
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Everything connected in one dashboard.
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p>✅ Track daily transactions</p>
              <p>✅ Monitor savings goals</p>
              <p>✅ Analyze monthly trends</p>
              <p>✅ Unlock AI-powered insights</p>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;