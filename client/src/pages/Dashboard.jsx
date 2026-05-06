import { useEffect, useState } from "react";

import {
  getFinancialSummary,
} from "../services/analyticsService";

import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../services/transactionService";

function Dashboard() {

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [transactions, setTransactions] = useState([]);

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
        
        const data = await getTransactions();

        setTransactions(data);

    } catch (error) {
        
        console.error(error);

    }

  };

  useEffect(() => {

    fetchSummary();
    fetchTransactions();

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

  const handleDelete =
  async (id) => {
    
    try {
        
        await deleteTransaction(id);

        fetchSummary();
        fetchTransactions();

    } catch (error) {
        console.error(error);

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

      <div className="mt-10 bg-zinc-900 p-8 rounded-2xl">
        
        <h2 className="text-2xl font-bold mb-6">
            Recent Transactions
        </h2>

        <div className="overflow-x-auto">
            
            <table className="w-full text-left">
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
                            
                            <td className="py-4 capitalize">
                                {transaction.type}
                            </td>

                            <td className="py-4">
                                {transaction.category}
                            </td>

                            <td className="py-4">
                                RM {transaction.amount}
                            </td>

                            <td className="py-4">
                                {new Date(
                                    transaction.transaction_date
                                ).toLocaleDateString("en-GB")}
                            </td>

                            <td className="py-4">
                                <button
                                 onClick={() =>
                                    handleDelete(transaction.id)
                                }
                                 className="bg-red-500 px-4 py-2 rounded-lg"
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

    </div>
  );
}

export default Dashboard;