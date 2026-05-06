import { useEffect, useState } from "react";

import {
  getFinancialSummary,
} from "../services/analyticsService";

function Dashboard() {

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  useEffect(() => {

    const fetchSummary = async () => {

      try {

        const data =
          await getFinancialSummary();

        setSummary(data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchSummary();

  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        FinSight AI Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-zinc-400">
            Total Balance
          </h2>

          <p className="text-3xl font-bold mt-2">
            RM {summary.balance}
          </p>

        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-zinc-400">
            Total Income
          </h2>

          <p className="text-3xl font-bold mt-2">
            RM {summary.totalIncome}
          </p>

        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-zinc-400">
            Total Expenses
          </h2>

          <p className="text-3xl font-bold mt-2">
            RM {summary.totalExpenses}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;