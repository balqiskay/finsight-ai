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

      </div>

    </MainLayout>
  );
}

export default Dashboard;