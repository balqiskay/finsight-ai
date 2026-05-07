import Sidebar from "../components/Sidebar";

function Transactions() {

  return (
    <div className="flex bg-zinc-950 text-white">

      <Sidebar />

      <div className="flex-1 p-8 min-h-screen">

        <h1 className="text-4xl font-bold">
          Transactions
        </h1>

      </div>

    </div>
  );
}

export default Transactions;