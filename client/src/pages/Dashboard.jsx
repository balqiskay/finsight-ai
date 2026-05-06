import { useEffect, useState } from "react";

import {
  getFinancialSummary,
} from "../services/analyticsService";

import {
  addTransaction,
} from "../services/transactionService";

function Dashboard() {

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    transaction_date: "",
  });

  const fetchSummary = async () => {

    try {

      const data =
        await getFinancialSummary();

      setSummary(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchSummary();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addTransaction(formData);

      fetchSummary();

      setFormData({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        transaction_date: "",
      });

    } catch (error) {

      console.error(error);

      alert("Failed to add transaction");

    }

  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        FinSight AI Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-10">

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

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl max-w-2xl"
      >

        <h2 className="text-2xl font-bold mb-6">
          Add Transaction
        </h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        >

          <option value="expense">
            Expense
          </option>

          <option value="income">
            Income
          </option>

        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="date"
          name="transaction_date"
          value={formData.transaction_date}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-6"
        />

        <button
          type="submit"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          Add Transaction
        </button>

      </form>

    </div>
  );
}

export default Dashboard;