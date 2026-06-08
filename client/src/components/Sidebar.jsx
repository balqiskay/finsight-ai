import {
  LayoutDashboard,
  Wallet,
  PieChart,
  LogOut,
  Menu,
  X,
  Bot,
  Receipt,
  CreditCard,
  Target,
  Repeat,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] =
    useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Transactions",
      path: "/transactions",
      icon: <Wallet size={20} />,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: <PieChart size={20} />,
    },
    {
      label: "AI Assistant",
      path: "/assistant",
      icon: <Bot size={20} />,
    },
    {
      label: "Receipt Scanner",
      path: "/receipt-scanner",
      icon: <Receipt size={20} />,
    },
    {
      label: "Savings Goals",
      path: "/savings",
      icon: <Target size={20} />,
    },
    {
      label: "Recurring",
      path: "/recurring",
      icon: <Repeat size={20} />,
    },
    {
      label: "Pricing",
      path: "/pricing",
      icon: <CreditCard size={20} />,
    },
  ];

  const navItemClass = (path) =>
    location.pathname === path
      ? "flex items-center gap-3 text-white bg-white/10 border border-white/10 px-4 py-3 rounded-2xl w-full shadow-[0_0_25px_rgba(59,130,246,0.10)]"
      : "flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 rounded-2xl w-full hover:bg-zinc-800/80 transition";

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900/90 backdrop-blur-xl text-white p-3 rounded-2xl border border-zinc-800 shadow-xl"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-72 min-h-screen h-screen bg-zinc-950/95 backdrop-blur-xl
          border-r border-zinc-800 p-5
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleNavigate("/dashboard")}
            className="text-left"
          >
            <h1 className="text-3xl font-extrabold text-white leading-none">
              Vayqor
            </h1>

            <p className="text-xs text-zinc-500 mt-1">
              Financial OS
            </p>
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Vayqor Pro
              </p>

              <p className="text-xs text-zinc-400">
                AI finance workspace
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNavigate("/pricing")}
            className="w-full bg-white text-black py-2 rounded-xl text-sm font-bold hover:scale-[1.02] transition"
          >
            Manage Plan
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={navItemClass(item.path)}
            >
              <span
                className={
                  location.pathname === item.path
                    ? "text-blue-400"
                    : ""
                }
              >
                {item.icon}
              </span>

              <span className="font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="pt-5 border-t border-zinc-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-4 py-3 rounded-2xl w-full transition"
          >
            <LogOut size={20} />
            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;