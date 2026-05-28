import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.goal_name ||
      !formData.target_amount
    ) {
      toast.error("Please fill in goal name and target amount.");
      return;
    }

    if (Number(formData.target_amount) <= 0) {
      toast.error("Target amount must be greater than 0.");
      return;
    }

    if (
      formData.current_amount &&
      Number(formData.current_amount) < 0
    ) {
      toast.error("Current amount cannot be negative.");
      return;
    }

    if (
        Number(formData.current_amount) >
        Number(formData.target_amount)
    ) {
        toast.error("Current amount cannot exceed target amount.");
        return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateSavingsGoal(editingId, formData);
        toast.success("Savings goal updated");
      } else {
        await addSavingsGoal(formData);
        toast.success("Savings goal added");
      }

      await fetchGoals();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save savings goal");
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
      toast.success("Savings goal deleted");
      await fetchGoals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete savings goal");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        Savings Goals
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 md:p-8 rounded-2xl mb-10"
      >
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "Update Goal" : "Create New Goal"}
        </h2>

        <input
          type="text"
          name="goal_name"
          placeholder="Goal name"
          value={formData.goal_name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="number"
          name="target_amount"
          min="1"
          placeholder="Target amount"
          value={formData.target_amount}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="number"
          name="current_amount"
          min="0"
          placeholder="Current saved amount"
          value={formData.current_amount}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-4"
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zinc-800 mb-6"
        />

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
                    onClick={() => handleDelete(goal.id)}
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
    </MainLayout>
  );
}

export default Savings;