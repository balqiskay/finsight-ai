import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../services/transactionService";

import {
  Plus,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const [formData, setFormData] = useState({
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const resetForm = () => {
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      transaction_date: "",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const showStatus = (type, title, message) => {
    setStatusMessage({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);

    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to load transactions",
        "Something went wrong while fetching your transactions."
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.amount ||
      !formData.transaction_date
    ) {
      showStatus(
        "error",
        "Missing information",
        "Please fill in category, amount, and date."
      );
      return;
    }

    if (Number(formData.amount) <= 0) {
      showStatus(
        "error",
        "Invalid amount",
        "Amount must be greater than 0."
      );
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateTransaction(editingId, formData);

        showStatus(
          "success",
          "Transaction updated",
          "Your transaction has been updated successfully."
        );
      } else {
        await addTransaction(formData);

        showStatus(
          "success",
          "Transaction added",
          "Your new transaction has been saved."
        );
      }

      await fetchTransactions();

      closeModal();
    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to save transaction",
        "Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await deleteTransaction(id);

      await fetchTransactions();

      showStatus(
        "success",
        "Transaction deleted",
        "The transaction has been removed."
      );
    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to delete transaction",
        "Please try again in a moment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);

    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || "",
      transaction_date: transaction.transaction_date?.slice(0, 10),
    });

    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalIncome - totalExpenses;

  const stats = [
    {
      title: "Balance",
      value: `RM ${balance.toFixed(2)}`,
      icon: <Wallet size={22} />,
      color: "text-blue-400",
    },
    {
      title: "Income",
      value: `RM ${totalIncome.toFixed(2)}`,
      icon: <TrendingUp size={22} />,
      color: "text-green-400",
    },
    {
      title: "Expenses",
      value: `RM ${totalExpenses.toFixed(2)}`,
      icon: <TrendingDown size={22} />,
      color: "text-red-400",
    },
  ];

  return (
    <MainLayout>
      <div className="w-full space-y-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-blue-400 font-semibold mb-2">
              Money Movement
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Transactions
            </h1>

            <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
              Track income, expenses, categories, and financial activity in one clean workspace.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="hidden sm:inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
          >
            <Plus size={18} />
            New Transaction
          </button>
        </div>

        {statusMessage && (
          <div
            className={`rounded-3xl border p-5 ${
              statusMessage.type === "success"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <p
              className={`font-semibold mb-1 ${
                statusMessage.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {statusMessage.title}
            </p>

            <p className="text-zinc-400 text-sm">
              {statusMessage.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-blue-500/30 hover:-translate-y-1 transition"
            >
              <div className={`${stat.color} mb-4`}>
                {stat.icon}
              </div>

              <p className="text-zinc-500 text-sm mb-2">
                {stat.title}
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold">
                {loadingTransactions ? "Loading..." : stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-5 sm:p-6 lg:p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Recent Transactions
              </h2>

              <p className="text-zinc-500 text-sm mt-1">
                Search, filter, edit, and manage your financial activity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex gap-2">
                {["all", "income", "expense"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-3 rounded-2xl text-sm font-semibold capitalize transition ${
                      filterType === type
                        ? "bg-white text-black"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Description</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-zinc-800/70 hover:bg-zinc-800/30 transition"
                    >
                      <td className="py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            transaction.type === "income"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td className="py-5 font-semibold">
                        {transaction.category}
                      </td>

                      <td className="py-5 text-zinc-500">
                        {transaction.description || "No description"}
                      </td>

                      <td
                        className={`py-5 font-bold ${
                          transaction.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"} RM{" "}
                        {transaction.amount}
                      </td>

                      <td className="py-5 text-zinc-400">
                        {transaction.transaction_date
                          ? new Date(transaction.transaction_date)
                              .toLocaleDateString("en-GB")
                          : "No Date"}
                      </td>

                      <td className="py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="bg-blue-500/10 text-blue-400 px-3 py-2 rounded-xl hover:bg-blue-500/20 transition"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(transaction.id)}
                            disabled={deletingId === transaction.id}
                            className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/20 disabled:opacity-50 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-16"
                    >
                      <EmptyState
                        loading={loadingTransactions}
                        onAdd={openAddModal}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-zinc-800/70 border border-zinc-700 rounded-3xl p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          transaction.type === "income"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>

                      <h3 className="text-xl font-bold mt-3">
                        {transaction.category}
                      </h3>

                      <p className="text-zinc-500 text-sm mt-1">
                        {transaction.description || "No description"}
                      </p>
                    </div>

                    <p
                      className={`text-lg font-extrabold whitespace-nowrap ${
                        transaction.type === "income"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} RM{" "}
                      {transaction.amount}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-zinc-500">
                      {transaction.transaction_date
                        ? new Date(transaction.transaction_date)
                            .toLocaleDateString("en-GB")
                        : "No Date"}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="bg-blue-500/10 text-blue-400 px-3 py-2 rounded-xl"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                        className="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                loading={loadingTransactions}
                onAdd={openAddModal}
              />
            )}
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="sm:hidden fixed bottom-6 right-6 z-40 bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        >
          <Plus size={26} />
        </button>

        {isModalOpen && (
          <TransactionModal
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            closeModal={closeModal}
            loading={loading}
            editingId={editingId}
          />
        )}

      </div>
    </MainLayout>
  );
}

function EmptyState({ loading, onAdd }) {
  if (loading) {
    return (
      <p className="text-zinc-500">
        Loading transactions...
      </p>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mb-5">
        <Wallet size={28} />
      </div>

      <h2 className="text-2xl font-bold mb-3 text-white">
        No Transactions Yet
      </h2>

      <p className="text-zinc-400 max-w-lg mx-auto mb-6">
        Add your first income or expense to begin tracking your financial activity.
      </p>

      <button
        onClick={onAdd}
        className="bg-white text-black px-6 py-3 rounded-2xl font-bold"
      >
        Add First Transaction
      </button>
    </div>
  );
}

function TransactionModal({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  closeModal,
  loading,
  editingId,
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[2rem] p-5 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-400 font-semibold mb-2">
              {editingId ? "Edit Transaction" : "New Transaction"}
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {editingId
                ? "Update financial record"
                : "Add money movement"}
            </h2>
          </div>

          <button
            onClick={closeModal}
            className="bg-zinc-800 text-zinc-400 hover:text-white p-3 rounded-2xl"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {["expense", "income"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type,
                  })
                }
                className={`p-4 rounded-2xl font-bold capitalize transition ${
                  formData.type === type
                    ? type === "income"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500/50"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500/50"
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500/50"
            />

            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              className="sm:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-zinc-900 border border-zinc-800 text-white px-6 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black px-6 py-4 rounded-2xl font-bold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Transaction"
                  : "Save Transaction"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Transactions;