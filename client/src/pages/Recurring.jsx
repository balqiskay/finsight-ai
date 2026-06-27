import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  addRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} from "../services/recurringService";

function Recurring() {
  const [transactions, setTransactions] = useState([]);

  const [loadingRecurring, setLoadingRecurring] = useState(true);

  const [formData, setFormData] = useState({
    type: "Expense",
    category: "",
    amount: "",
    description: "",
    frequency: "Monthly",
    start_date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [statusMessage, setStatusMessage] = useState(null);

  const [errors, setErrors] = useState({});

  const showStatus = (type, title, message) => {
    setStatusMessage({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const fetchRecurringTransactions =
    async () => {

      setLoadingRecurring(true);

      try {
        const data =
          await getRecurringTransactions();

        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRecurring(false);
      }
    };

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      type: "Expense",
      category: "",
      amount: "",
      description: "",
      frequency: "Monthly",
      start_date: "",
    });

    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required.";
    }
    else if (
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required.";
    }

    if (
      Object.keys(newErrors).length > 0
    ) {
      
      setErrors(newErrors);

      showStatus(
        "error",
        "Please correct the highlighted fields",
        "Some required information is missing."
      );

      return;
    }

    setErrors({});
    

    if (
      Number(formData.amount) <= 0
    ) {
      showStatus(
        "error",
        "Invalid amount",
        "Amount must be greater than 0."
      );

      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateRecurringTransaction(
          editingId,
          formData
        );

        showStatus(
          "success",
          "Recurring transaction updated",
          "Your recurring transaction has been updated successfully."
        );
      } else {
        await addRecurringTransaction(
          formData
        );

        showStatus(
          "success",
          "Recurring transaction added",
          "Your recurring transaction has been created."
        );
      }

      await fetchRecurringTransactions();

      resetForm();
    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to save recurring transaction",
        "Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);

    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description:
        transaction.description || "",
      frequency:
        transaction.frequency,
      start_date:
      transaction.start_date
      ?.slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await deleteRecurringTransaction(id);

      showStatus(
        "success",
        "Recurring transaction deleted",
        "The recurring transaction has been removed."
      );

      await fetchRecurringTransactions();
    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to delete recurring transaction",
        "Please try again in a moment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mb-10">
        
        <p className="text-blue-400 font-semibold mb-2">
          Financial Automation
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Recurring Transactions
        </h1>

        <p className="text-zinc-400 max-w-2xl leading-relaxed">
          Automate your recurring income and expenses such as salaries,
          subscriptions, rent, utilities, and monthly bills to keep your
          finances organized effortlessly.
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-blue-500/30 transition">
        
        <p className="text-zinc-400 text-sm mb-2">
          Total Recurring
        </p>

        <h2 className="text-3xl font-extrabold">
          {transactions.length}
        </h2>

        <p className="text-zinc-500 text-sm mt-2">
          Active recurring plans
        </p>

      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500/30 transition">
      
      <p className="text-zinc-400 text-sm mb-2">
        Income Plans
      </p>

      <h2 className="text-3xl font-extrabold text-green-400">
        {
        transactions.filter(
          t => t.type === "Income"
        ).length
        }
      </h2>

      <p className="text-zinc-500 text-sm mt-2">
        Automated income
      </p>

    </div>

    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-red-500/30 transition">
    
    <p className="text-zinc-400 text-sm mb-2">
      Expense Plans
    </p>

    <h2 className="text-3xl font-extrabold text-red-400">
      {
        transactions.filter(
          t => t.type === "Expense"
        ).length
      }
    </h2>

    <p className="text-zinc-500 text-sm mt-2">
      Automated expenses
    </p>

    </div>

  </div>

  {statusMessage && (
    <div
     className={`mb-8 rounded-3xl border p-5 ${
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

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-xl mb-10"
      >
        <h2 className="text-3xl font-extrabold mb-2">
          <p className="text-zinc-500 mb-8">
            {editingId
            ? "Update your recurring transaction."
            : "Create automatic income and expense schedules."}
          </p>
        </h2>

        <div className="flex gap-2 mb-4">
            
            <button
              type="button"
              onClick={() =>
                setFormData({
                    ...formData,
                    type: "Expense",
                })
              }
              className={`flex-1 p-3 rounded-lg transition duration-300 ${
                formData.type === "Expense"
                ? "bg-red-500 text-white font-semibold"
                : "bg-zinc-800 text-white"
              }`}
            >
                EXPENSE
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({
                    ...formData,
                    type: "Income",
                })
              }
              className={`flex-1 p-3 rounded-lg transition duration-300 ${
                formData.type === "Income"
                ? "bg-green-500 text-white font-semibold"
                : "bg-zinc-800 text-white"
              }`}
            >
                INCOME
            </button>

        </div>

        <div className="mb-4">
          
          <label className="block text-zinc-400 text-sm mb-2">
            Category
            <span className="text-red-400"> *</span>
          </label>

          <input
           type="text"
           name="category"
           placeholder="Subscription"

           value={formData.category}

           onChange={(e)=>{
            
            handleChange(e);

            setErrors(prev=>({
              
              ...prev,

              category:"",

            }));

           }}

           className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.category
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.category &&(
            
            <p className="text-red-400 text-sm mt-2">
              {errors.category}
            </p>

          )}

        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-sm mb-2">
            Amount <span className="text-red-400">*</span>
          </label>

          <input
           type="number"
           name="amount"
           min="1"
           placeholder="99.90"
           value={formData.amount}
           onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({
              ...prev,
              amount: "",
            }));
          }}
          className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.amount
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.amount && (
            <p className="text-red-400 text-sm mt-2">
              {errors.amount}
            </p>
          )}
        </div>

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            
            {["Daily", "Weekly", "Monthly", "Yearly"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFormData({
                        ...formData,
                        frequency: item,
                    })
                  }
                  className={`p-3 rounded-lg transition duration-300 ${
                    formData.frequency === item
                    ? "bg-blue-500 text-white font-semibold"
                    : "bg-zinc-800 text-white"
                  }`}
                >
                    {item}
                </button>
            ))}

        </div>

        <div className="mb-6">
          <label className="block text-zinc-400 text-sm mb-2">
            Start Date <span className="text-red-400">*</span>
          </label>

          <input
           type="date"
           name="start_date"
           value={formData.start_date}
           onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({
              ...prev,
              start_date: "",
            }));
          }}
          className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.start_date
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.start_date && (
            <p className="text-red-400 text-sm mt-2">
              {errors.start_date}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update"
                : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-zinc-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingRecurring ? (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
            Loading recurring transactions...
          </div>
        ) : transactions.length > 0 ? (
          transactions.map(
            (transaction) => (
              <div
                key={transaction.id}
                className="bg-zinc-900 p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {transaction.category}
                  </h2>

                  <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                    {transaction.frequency}
                  </span>
                </div>

                <p
                  className={`text-2xl font-bold mb-2 ${
                    transaction.type ===
                    "Income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type ===
                  "Income"
                    ? "+"
                    : "-"}
                  RM {transaction.amount}
                </p>

                {transaction.description && (
                  <p className="text-zinc-400 mb-4">
                    {
                      transaction.description
                    }
                  </p>
                )}

                {transaction.start_date && (() => {
                  
                  const startDate = new Date(transaction.start_date + "T00:00:00");

                  const nextDate = new Date(startDate);

                  const today = new Date();

                  while (nextDate < today) {
                    
                    if (transaction.frequency === "Monthly") {
                      nextDate.setMonth(nextDate.getMonth() + 1);
                    } else if (transaction.frequency === "Weekly") {
                      nextDate.setDate(nextDate.getDate() + 7);
                    } else if (transaction.frequency === "Yearly") {
                      nextDate.setFullYear(nextDate.getFullYear() + 1);
                    } else if (transaction.frequency === "Daily") {
                      nextDate.setDate(nextDate.getDate() + 1);
                    } else {
                      break;
                    }

                  }

                  return (
                  <div className="mb-4">
                    
                    <p className="text-sm text-zinc-500 mb-1">
                      Starts:{" "}
                      {new Date(transaction.start_date + "T00:00:00")
                      .toLocaleDateString("en-GB")}
                    </p>

                    <p className="text-sm font-semibold text-blue-400">
                      Next recurring:{" "}
                      {nextDate.toLocaleDateString("en-GB")}
                    </p>

                  </div>
                );

                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleEdit(
                        transaction
                      )
                    }
                    className="flex-1 bg-blue-500 px-3 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        transaction.id
                      )
                    }
                    disabled={
                      deletingId ===
                      transaction.id
                    }
                    className="flex-1 bg-red-500 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                    {deletingId ===
                    transaction.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

            <h2 className="text-2xl font-bold mb-3">
              No Recurring Transactions Yet
            </h2>

            <p className="text-zinc-400">
              Create recurring transactions for salaries, bills, subscriptions, and other repeating finances.
            </p>

          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Recurring;