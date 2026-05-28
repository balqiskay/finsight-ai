import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import toast from "react-hot-toast";

import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../services/transactionService";

function Transactions() {

  const [transactions, setTransactions] =
    useState([]);

  const [loadingTransactions, setLoadingTransactions] =
  useState(true);

  const [formData, setFormData] =
    useState({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      transaction_date: "",
    });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchTransactions =
    async () => {

      setLoadingTransactions(true);
      
      try {

        const data =
          await getTransactions();

        setTransactions(data);

      } catch (error) {

        console.error(error);

      } finally {
        
        setLoadingTransactions(false);

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

    if (
      !formData.category ||
      !formData.amount ||
      !formData.transaction_date
    ) {
      toast.error("Please fill in category, amount, and date.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    
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

      setLoading(false);

      setFormData({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        transaction_date: "",
      });

    } catch (error) {

      setLoading(false);
      
      console.error(error);

      toast.error(
        "Failed to save transaction"
      );

    }

  };

  const handleDelete =
    async (id) => {
      
      try {
        
        setDeletingId(id);

        await deleteTransaction(id);

        fetchTransactions();

      } catch (error) {
        
        console.error(error);

      } finally {
        
        setDeletingId(null);

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

  const filteredTransactions =
  transactions.filter(
    (transaction) => {

      const matchesSearch =

        transaction.category
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

        ||

        transaction.description
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesType =

        filterType === "all"

        ||

        transaction.type ===
        filterType;

      return (
        matchesSearch &&
        matchesType
      );

    }
  );

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

        <div className="flex gap-2 mb-4">
          
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                type: "expense",
              })
            }
            className={`flex-1 p-3 rounded-lg transition duration-300 ${
              formData.type === "expense"
              ? "bg-red-500 text-white font-semibold"
              : "bg-zinc-800 text-white"
            }`}
          >
            Expense
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                type: "income",
              })
            }
            className={`flex-1 p-3 rounded-lg transition duration-300 ${
              formData.type === "income"
              ? "bg-green-500 text-white font-semibold"
              : "bg-zinc-800 text-white"
            }`}
          >
            Income
          </button>

        </div>

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
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          {loading
            ? "Saving..."
            : editingId
              ? "Update Transaction"
              : "Add Transaction"}
        </button>

      </form>

      <div className="mt-10 bg-zinc-900 p-6 md:p-8 rounded-2xl">

        <h2 className="text-2xl font-bold mb-6">
          Recent Transactions
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          
          <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="flex-1 p-3 rounded-lg bg-zinc-800"
          />

          <div className=" flex flex-wrap gap-2">
            
            <button
              type="button"
              onClick={() =>
                setFilterType("all")
              }
              className={`flex-1 p-3 rounded-lg transition duration-300
              ${
                filterType === "all"
                ? "bg-white text-black font-semibold"
                : "bg-zinc-800 text-white"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() =>
                setFilterType("income")
              }
              className={`flex-1 p-3 rounded-lg transition duration-300
              ${
                filterType === "income"
                ? "bg-green-500 text-white font-semibold"
                : "bg-zinc-800 text-white"
              }`}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() =>
                setFilterType("expense")
              }
              className={`flex-1 p-3 rounded-lg transition duration-300
              ${
                filterType === "expense"
                ? "bg-red-500 text-white font-semibold"
                : "bg-zinc-800 text-white"
              }`}
            >
              Expense
            </button>

          </div>

        </div>

        <div className="hidden md:block w-full">
          
          <table className="w-full text-left text-base">
            
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
              
              {filteredTransactions.length > 0 ? (
                
                filteredTransactions.map((transaction) => (
                
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
                    {transaction.transaction_date
                    ? new Date(
                      transaction.transaction_date
                    ).toLocaleDateString("en-GB")
                    : "No Date"}
                  </td>

                  <td className="py-4">
                    
                    <div className="flex gap-2">
                      
                      <button
                      onClick={() =>
                        handleEdit(transaction)
                      }
                      className="bg-blue-500 px-3 py-2 rounded-lg text-sm transition duration-300 hover:scale-[1.02]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(transaction.id)
                        }
                        disabled={deletingId === transaction.id}
                        className="bg-red-500 px-3 py-2 rounded-lg text-sm transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === transaction.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (
            
            <tr>
              
              <td
                colSpan="5"
                className="text-center py-10 text-zinc-500"
              >
                {loadingTransactions ? (
                  "Loading transactions..."
                ) : (
                <div className="text-center py-6">
                  
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    No Transactions Yet
                  </h2>

                  <p className="text-zinc-400 max-w-lg mx-auto">
                    Add your first income or expense transaction to begin tracking your financial activity and unlock analytics insights.
                  </p>

                </div>
              )}
            </td>

            </tr>

            )}

            </tbody>

          </table>

        </div>

        <div className="md:hidden space-y-4">
          
          {filteredTransactions.length > 0 ? (
            
            filteredTransactions.map((transaction) => (
            
            <div
              key={transaction.id}
              className="bg-zinc-800 p-4 rounded-2xl"
            >
              
              <div className="flex items-center justify-between mb-3">
                
                <div>
                  
                  <p className="text-sm text-zinc-400">
                    {transaction.type}
                  </p>

                  <h3 className="text-lg font-bold">
                    {transaction.category}
                  </h3>

                </div>

                <p className="text-lg font-bold">
                  RM {transaction.amount}
                </p>

              </div>

              <p className="text-sm text-zinc-400 mb-4">
                {transaction.transaction_date
                ? new Date(
                  transaction.transaction_date
                ).toLocaleDateString("en-GB")
                : "No Date"}
              </p>

              <div className="flex gap-2">
                
                <button
                  onClick={() =>
                    handleEdit(transaction)
                  }
                  className="bg-blue-500 px-3 py-2 rounded-lg text-sm transition duration-300 hover:scale-[1.02]"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(transaction.id)
                  }
                  disabled={deletingId === transaction.id}
                  className="bg-red-500 px-3 py-2 rounded-lg text-sm transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === transaction.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            </div>

            ))

          ) : (
          
          <div className="text-center py-10 text-zinc-500">
            {loadingTransactions ? (
              "Loading transactions..."
            ) : (
            <div className="text-center py-6">
              
              <h2 className="text-2xl font-bold mb-3 text-white">
                No Transactions Yet
              </h2>

              <p className="text-zinc-400 max-w-lg mx-auto">
                Add your first income or expense transaction to begin tracking your financial activity and unlock analytics insights.
              </p>

            </div>
          )}
        </div>

          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default Transactions;