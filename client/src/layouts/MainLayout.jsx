import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {

  return (
    <div className="flex bg-zinc-950 text-white w-full overflow-x-hidden">

      <Sidebar />

      <div className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8 min-h-screen">

        {children}

      </div>

    </div>
  );
}

export default MainLayout;