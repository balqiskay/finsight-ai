import {
  LayoutDashboard,
  Wallet,
  PieChart,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItemClass = (path) =>
    location.pathname === path
      ? "flex items-center gap-3 text-white bg-zinc-800 px-4 py-3 rounded-xl w-full"
      : "flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 rounded-xl w-full hover:bg-zinc-800 transition";

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900 text-white p-3 rounded-xl border border-zinc-800"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40"
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 p-6
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-white">
            FinSight AI
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-zinc-400"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => handleNavigate("/dashboard")}
            className={navItemClass("/dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => handleNavigate("/transactions")}
            className={navItemClass("/transactions")}
          >
            <Wallet size={20} />
            Transactions
          </button>

          <button
            onClick={() => handleNavigate("/analytics")}
            className={navItemClass("/analytics")}
          >
            <PieChart size={20} />
            Analytics
          </button>

          <button
            onClick={() => handleNavigate("/savings")}
            className={navItemClass("/savings")}
          >
            <Wallet size={20} />
            Savings Goals
          </button>

          <button
            onClick={() => handleNavigate("/recurring")}
            className={navItemClass("/recurring")}
          >
            <Wallet size={20} />
            Recurring
          </button>
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl w-full transition mt-20"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;