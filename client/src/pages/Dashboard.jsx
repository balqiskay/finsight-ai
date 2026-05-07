import { useEffect, useState } from "react";

import {
  getFinancialSummary,
  getCategoryBreakdown,
} from "../services/analyticsService";

import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../services/transactionService";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import MainLayout from "../layouts/MainLayout";

function Dashboard() {

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const [categoryData, setCategoryData] = useState([]);

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

  const fetchTransactions = async () => {

    try {

      const data =
        await getTransactions();

      setTransactions(data);

    } catch (error) {

      console.error(error);

    }

  };

  const fetchCategoryData = async () => {

    try {

      const data =
        await getCategoryBreakdown();

      setCategoryData(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchSummary();
    fetchTransactions();
    fetchCategoryData();

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
      fetchTransactions();
      fetchCategoryData();

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

  const handleDelete = async (id) => {

    try {

      await deleteTransaction(id);

      fetchSummary();
      fetchTransactions();
      fetchCategoryData();

    } catch (error) {

      console.error(error);

    }

  };

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
  ];

  return (
    <MainLayout>

      <div className="w-full">

        <h1 className="text-2xl md:text-4xl font-bold mb-8">
          FinSight AI Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 p-6 rounded-2xl w-full">

            <h2 className="text-zinc-400">
              Total Balance
            </h2>

            <p className="text-3xl font-bold mt-2">
              RM {summary.balance}
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl w-full">

            <h2 className="text-zinc-400">
              Total Income
            </h2>

            <p className="text-3xl font-bold mt-2">
              RM {summary.totalIncome}
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl w-full">

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
          className="bg-zinc-900 p-6 md:p-8 rounded-2xl w-full"
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

        <div className="mt-10 bg-zinc-900 p-6 md:p-8 rounded-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Recent Transactions
          </h2>

          <div className="w-full">

            <table className="w-full text-left text-xs md:text-base">

              <thead>

                <tr className="border-b border-zinc-700">

                  <th className="pb-4">
                    Type
                  </th>

                  <th className="pb-4">
                    Category
                  </th>

                  <th className="pb-4">
                    Amount
                  </th>

                  <th className="pb-4">
                    Date
                  </th>

                  <th className="pb-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {transactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="border-b border-zinc-800"
                  >

                    <td className="py-3 pr-2 capitalize">
                      {transaction.type}
                    </td>

                    <td className="py-3 pr-2">
                      {transaction.category}
                    </td>

                    <td className="py-3 pr-2">
                      RM {transaction.amount}
                    </td>

                    <td className="py-3 pr-2">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="py-3 pr-2">

                      <button
                        onClick={() =>
                          handleDelete(transaction.id)
                        }
                        className="bg-red-500 px-2 py-1 rounded-lg text-xs md:text-sm"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="mt-10 bg-zinc-900 p-6 md:p-8 rounded-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Expense Categories
          </h2>

          <div className="w-full flex justify-center">

            <div className="w-[280px] h-[280px] md:w-[400px] md:h-[400px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryData.map(item => ({
                      ...item,
                      total: Number(item.total)
                    }))}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    label={false}
                  >

                    {categoryData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index % COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;