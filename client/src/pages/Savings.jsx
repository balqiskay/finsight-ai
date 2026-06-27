import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  addSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../services/savingsService";

function Savings() {
  const [goals, setGoals] = useState([]);

  const [loadingGoals, setLoadingGoals] = useState(true);
  
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "",
    deadline: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const fetchGoals = async () => {
    setLoadingGoals(true);

    try {
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGoals(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      goal_name: "",
      target_amount: "",
      current_amount: "",
      deadline: "",
    });

    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.goal_name.trim()) {
      newErrors.goal_name = "Goal name is required.";
    }

    if (!formData.target_amount) {
      newErrors.target_amount = "Target amount is required.";
    } else if (Number(formData.target_amount) <= 0) {
      newErrors.target_amount = "Target amount must be greater than 0.";
    }

    if (
      formData.current_amount &&
      Number(formData.current_amount) < 0
    ) {
      newErrors.current_amount = "Current amount cannot be negative.";
    }

    if (
      formData.current_amount &&
      formData.target_amount &&
      Number(formData.current_amount) >
      Number(formData.target_amount)
    ) {
      newErrors.current_amount = "Current amount cannot exceed target amount.";
    }

    if (
      formData.deadline &&
      new Date(formData.deadline) <
      new Date(new Date().toISOString().split("T")[0])
    ) {
      newErrors.deadline = "Deadline cannot be in the past.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      showStatus(
        "error",
        "Please correct the highlighted fields",
        "Some required information is missing or invalid."
      );
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      if (editingId) {
        await updateSavingsGoal(editingId, formData);
        showStatus(
          "success",
          "Savings goal updated",
          "Your savings goal has been updated successfully."
        );
      } else {
        await addSavingsGoal(formData);
        showStatus(
          "success",
          "Savings goal added",
          "Your new savings target has been created."
        );
      }

      await fetchGoals();
      resetForm();
    } catch (error) {
      console.error(error);
      showStatus(
        "error",
        "Failed to save goal",
        "Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);

    setFormData({
      goal_name: goal.goal_name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      deadline:
      goal.deadline
        ? goal.deadline.slice(0, 10)
        : "",
    });
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteSavingsGoal(id);
      showStatus(
        "success",
        "Savings goal deleted",
        "The savings goal has been removed."
      );
      await fetchGoals();
    } catch (error) {
      console.error(error);
      showStatus(
        "error",
        "Failed to delete goal",
        "Please try again in a moment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mb-10">
      
      <p className="text-purple-400 font-semibold mb-2">
        Future Planning
      </p>

      <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
        Savings Goals
      </h1>

      <p className="text-zinc-400 max-w-2xl leading-relaxed">
        Plan your financial future, monitor your savings progress,
        and achieve your personal financial milestones with Vayqor.
      </p>

    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        
        <p className="text-zinc-400 text-sm mb-2">
          Total Goals
        </p>

        <h2 className="text-3xl font-extrabold">
          {goals.length}
        </h2>

      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        
        <p className="text-zinc-400 text-sm mb-2">
          Completed Goals
        </p>

        <h2 className="text-3xl font-extrabold text-green-400">
          {
          goals.filter(
            goal =>
              Number(goal.current_amount) >=
              Number(goal.target_amount)
          ).length
          }
        </h2>

      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        
        <p className="text-zinc-400 text-sm mb-2">
          Completion Rate
        </p>

        <h2 className="text-3xl font-extrabold text-purple-400">
          {goals.length > 0
          ? (
            goals.filter(
              goal =>
                Number(goal.current_amount) >=
                Number(goal.target_amount)
            ).length /
            goals.length *
            100
          ).toFixed(0)
          : 0}
          %
        </h2>

      </div>

    </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 md:p-8 rounded-2xl mb-10"
      >
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "Update Goal" : "Create New Goal"}
        </h2>

        <div className="mb-4">
          <label className="block text-zinc-400 text-sm mb-2">
            Goal Name <span className="text-red-400">*</span>
          </label>

          <input
           type="text"
           name="goal_name"
           placeholder="Emergency Fund"
           value={formData.goal_name}
           onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({
              ...prev,
              goal_name: "",
            }));
           }}
           className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.goal_name
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.goal_name && (
            <p className="text-red-400 text-sm mt-2">
              {errors.goal_name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-sm mb-2">
            Target Amount <span className="text-red-400">*</span>
          </label>

          <input
           type="number"
           name="target_amount"
           min="1"
           placeholder="5000"
           value={formData.target_amount}
           onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({
              ...prev,
              target_amount: "",
            }));
           }}
           className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.target_amount
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.target_amount && (
            <p className="text-red-400 text-sm mt-2">
              {errors.target_amount}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-sm mb-2">
            Current Saved Amount
          </label>

          <input
           type="number"
           name="current_amount"
           min="0"
           placeholder="0"
           value={formData.current_amount}
           onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({
              ...prev,
              current_amount: "",
            }));
          }}
          className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.current_amount
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.current_amount && (
            <p className="text-red-400 text-sm mt-2">
              {errors.current_amount}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-zinc-400 text-sm mb-2">
            Deadline Date
          </label>

          <input
           type="date"
           name="deadline"
           value={formData.deadline}
           onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({
              ...prev,
              deadline: "",
            }));
          }}
          className={`w-full p-3 rounded-lg bg-zinc-800 border outline-none ${
            errors.deadline
            ? "border-red-500"
            : "border-zinc-700"
           }`}
          />
          
          {errors.deadline && (
            <p className="text-red-400 text-sm mt-2">
              {errors.deadline}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition duration-300 hover:scale-[1.02]"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Goal"
                : "Add Goal"}
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
        {loadingGoals ? (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
            Loading savings goals...
          </div>
        ) : goals.length > 0 ? (
          goals.map((goal) => {
            const progress =
              Number(goal.target_amount) > 0
                ? Math.min(
                    (Number(goal.current_amount) /
                      Number(goal.target_amount)) *
                      100,
                    100
                  )
                : 0;

                const progressColor =
                  progress >= 100
                    ? "bg-green-500"
                    : progress >= 70
                      ? "bg-blue-500"
                      : progress >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500";

            return (
              <div
                key={goal.id}
                className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                    
                    <h2 className="text-2xl font-bold">
                        {goal.goal_name}
                    </h2>

                    {progress >= 100 && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">
                            Completed
                        </span>
                     )}

                </div>

                <p className="text-zinc-400 mb-4">
                  RM {goal.current_amount} / RM {goal.target_amount}
                </p>

                <div className="w-full bg-zinc-800 rounded-full h-3 mb-3">
                  <div
                    className={`${progressColor} h-3 rounded-full transition-all duration-700`}
                    style={{
                        width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-zinc-400 mb-4">
                  {progress.toFixed(1)}% completed
                </p>

                {goal.deadline && (() => {
                  
                  const today = new Date();

                  const deadline = new Date(goal.deadline);

                  const timeDiff = deadline - today;

                  const daysRemaining =
                  Math.ceil(
                    timeDiff / (1000 * 60 * 60 * 24)
                  );

                  return (
                  
                  <div className="mb-4">
                    
                    <p className="text-sm text-zinc-500 mb-1">
                      Deadline:{" "}
                      {new Date(goal.deadline)
                      .toLocaleDateString("en-GB")}
                    </p>

                    <p
                     className={`text-sm font-semibold ${
                      progress >= 100
                      ? "text-green-400"
                      : daysRemaining < 0
                      ? "text-red-400"
                      : daysRemaining <= 7
                      ? "text-yellow-400"
                      : "text-green-400"
                     }`}
                    >
                      
                      {progress >= 100
                       ? "Goal achieved"
                       : daysRemaining < 0
                       ? "Deadline passed"
                       : `${daysRemaining} days remaining`}

                    </p>

                  </div>

                  );

                })()}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="flex-1 bg-blue-500 px-3 py-2 rounded-lg text-sm transition duration-300 hover:scale-[1.02]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteTarget(goal)}
                    disabled={deletingId === goal.id}
                    className="flex-1 bg-red-500 px-3 py-2 rounded-lg text-sm transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === goal.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
            
            <h2 className="text-2xl font-bold mb-3">
                No Savings Goals Yet
            </h2>

            <p className="text-zinc-400">
                Start creating savings goals to track your financial progress and achieve your future targets.
            </p>

          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/30 rounded-[2rem] p-6 shadow-2xl">
          
          <h2 className="text-2xl font-extrabold mb-3">
            Delete Savings Goal?
          </h2>

          <p className="text-zinc-400 mb-6">
            You are about to delete{" "}
            <span className="text-white font-semibold">
              {deleteTarget.goal_name}
            </span>
            . This action cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
             onClick={() => setDeleteTarget(null)}
             className="flex-1 bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
             onClick={async () => {
              await handleDelete(deleteTarget.id);
              setDeleteTarget(null);
             }}
             disabled={deletingId === deleteTarget.id}
             className="flex-1 bg-red-500 text-white px-5 py-3 rounded-2xl font-bold hover:bg-red-600 transition disabled:opacity-50"
            >
              {deletingId === deleteTarget.id
              ? "Deleting..."
              : "Delete"}
            </button>
          </div>

        </div>
      </div>
    )}

    </MainLayout>
  );
}

export default Savings;