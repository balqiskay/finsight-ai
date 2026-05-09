import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../services/transactionService";

function Transactions() {

  const [transactions, setTransactions] =
    useState([]);

  const [formData, setFormData] =
    useState({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      transaction_date: "",
    });

  const [editingId, setEditingId] = useState(null);

  const fetchTransactions =
    async () => {

      try {

        const data =
          await getTransactions();

        setTransactions(data);

      } catch (error) {

        console.error(error);

      }

  };

  useEffect(() => {

    fetchTransactions();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit =
  async (e) => {
    
    e.preventDefault();
    
    try {
      
      if (editingId) {
        
        await updateTransaction(
          editingId,
          formData
        );
        
        setEditingId(null);

      } else {
        
        await addTransaction(
          formData
        );

      }
      
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

      alert(
        "Failed to save transaction"
      );

    }

  };

  const handleDelete =
    async (id) => {

      try {

        await deleteTransaction(id);

        fetchTransactions();

      } catch (error) {

        console.error(error);

      }

  };

  const handleEdit =
  (transaction) => {
    
    setEditingId(
      transaction.id
    );

    setFormData({
      type: transaction.type,

      category: transaction.category,

      amount: transaction.amount,

      description: transaction.description,

      transaction_date:
      new Date(
        transaction.transaction_date
        ).toISOString().split("T")[0]
    });

  };

  return (
    <MainLayout>

      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        Transactions
      </h1>

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
          {editingId
          ? "Update Transaction"
          : "Add Transaction"}
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
                    {transaction.transaction_date &&
                    !isNaN(
                      new Date(
                        transaction.transaction_date
                      )
                    )
                    ? new Date(
                      transaction.transaction_date
                    ).toLocaleDateString("en-GB")
                    : "Invalid Date"}
                  </td>

                  <td className="py-3 pr-2">
                    <div className="flex gap-2">
                    
                    <button
                    onClick={() =>
                      handleEdit(transaction)
                    }
                    className="bg-blue-500 px-2 py-1 rounded-lg text-xs md:text-sm"
                    >
                      Edit
                    </button>

                    <button
                    onClick={() =>
                      handleDelete(transaction.id)
                    }
                    className="bg-red-500 px-2 py-1 rounded-lg text-xs md:text-sm"
                    >
                      Delete
                    </button>

                  </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
}

export default Transactions;