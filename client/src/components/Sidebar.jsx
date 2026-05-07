import {
  LayoutDashboard,
  Wallet,
  PieChart,
  LogOut,
} from "lucide-react";

function Sidebar() {

  return (
    <div className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 p-6">

      <h1 className="text-3xl font-bold text-white mb-10">
        FinSight AI
      </h1>

      <nav className="space-y-4">

        <button className="flex items-center gap-3 text-white bg-zinc-800 px-4 py-3 rounded-xl w-full">

          <LayoutDashboard size={20} />

          Dashboard

        </button>

        <button className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 rounded-xl w-full hover:bg-zinc-800 transition">

          <Wallet size={20} />

          Transactions

        </button>

        <button className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 rounded-xl w-full hover:bg-zinc-800 transition">

          <PieChart size={20} />

          Analytics

        </button>

      </nav>

      <button className="flex items-center gap-3 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl w-full transition mt-20">

        <LogOut size={20} />

        Logout

      </button>

    </div>
  );
}

export default Sidebar;