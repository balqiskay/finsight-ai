import { useEffect, useState } from "react";

import {
  getFinancialSummary,
} from "../services/analyticsService";

import MainLayout from "../layouts/MainLayout";

function Dashboard() {

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {

    try {
      setLoading(true);

      const data =
        await getFinancialSummary();

      setSummary(data);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.error(error);

    }

  };

  useEffect(() => {

    fetchSummary();

  }, []);

  return (
    <MainLayout>

      <div className="w-full">

        <h1 className="text-2xl md:text-4xl font-bold mb-8">
          FinSight AI Dashboard
        </h1>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-8 md:p-12 rounded-3xl mb-8 shadow-[0_0_60px_rgba(59,130,246,0.35)] border border-white/10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
          
          <h2 className="relative z-10 text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to your AI Finance Command Center
          </h2>

          <p className="relative z-10 text-blue-100/90 text-lg md:text-xl max-w-3xl leading-relaxed">
            Track your money, analyze spending patterns, generate AI-powered insights,
            and export smart financial reports — all in one dashboard.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-8">
            
            <button
              onClick={() => window.location.href = "/transactions"}
              className="bg-white text-black px-6 py-3 rounded-2xl font-bold transition duration-300 hover:scale-[1.03] shadow-xl"
            >
              Start Tracking
            </button>

            <button
              onClick={() => window.location.href = "/analytics"}
              className="bg-black/20 backdrop-blur-xl text-white px-6 py-4 rounded-2xl font-bold border border-white/20 transition duration-300 hover:scale-[1.03]"
            >
              View AI Insights
            </button>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 p-6 rounded-2xl w-full transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">

            <h2 className="text-zinc-400">
              Total Balance
            </h2>

            {loading ? (
              
              <div className="h-10 w-40 bg-zinc-800 rounded animate-pulse mt-2" />

            ) : (
            
            <p className="text-3xl font-bold mt-2">
              RM {summary.balance}
            </p>

            )}

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl w-full transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">

            <h2 className="text-zinc-400">
              Total Income
            </h2>

            {loading ? (
              
              <div className="h-10 w-40 bg-zinc-800 rounded animate-pulse mt-2" />

            ) : (
            
            <p className="text-3xl font-bold mt-2">
              RM {summary.totalIncome}
            </p>

            )}

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl w-full transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">

            <h2 className="text-zinc-400">
              Total Expenses
            </h2>

            {loading ? (
              
              <div className="h-10 w-40 bg-zinc-800 rounded animate-pulse mt-2" />

            ) : (
            
            <p className="text-3xl font-bold mt-2">
              RM {summary.totalExpenses}
            </p>

            )}

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">
            
            <h2 className="text-2xl font-bold mb-3">
              Quick Actions
            </h2>

            <p className="text-zinc-400 mb-6">
              Manage your finances faster from one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              
              <button
                onClick={() =>
                  window.location.href = "/transactions"
                }
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold transition duration-300 hover:scale-[1.02]"
              >
                Add Transaction
              </button>

              <button
                onClick={() =>
                  window.location.href = "/analytics"
                }
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition duration-300 hover:scale-[1.02]"
              >
                View Analytics
              </button>

            </div>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">
            
            <h2 className="text-2xl font-bold mb-3">
              Financial Snapshot
            </h2>

            <p className="text-zinc-400 mb-6">
              Your dashboard summarizes your income, expenses, and balance in real time.
            </p>

            <div className="space-y-3 text-zinc-300">
              
              <p>
                ✅ Track daily transactions
              </p>

              <p>
                ✅ Analyze monthly trends
              </p>

              <p>
                ✅ Generate AI-powered financial insights
              </p>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;