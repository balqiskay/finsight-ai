import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {

  return (
    <div className="flex bg-zinc-950 text-white">

      <Sidebar />

      <div className="flex-1 p-8 min-h-screen">

        {children}

      </div>

    </div>
  );
}

export default MainLayout;