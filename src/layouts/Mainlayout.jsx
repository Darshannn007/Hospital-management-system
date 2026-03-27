import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f172a]">

      {/* 🔥 Sidebar (fixed) */}
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* 🔥 Right Side */}
      <div className="flex-1 flex flex-col h-screen">

        {/* 🔥 Navbar */}
        <div className="h-16 bg-[#1e293b] border-b border-white/10 px-6 flex items-center justify-between shadow-md sticky top-0 z-10">
          
          <h1 className="text-lg font-semibold text-white">
          
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Darshan</span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1fad9f] to-[#67e1cf] flex items-center justify-center text-white font-bold shadow-md">
              D
            </div>
          </div>

        </div>

        {/* 🔥 Scrollable Content */}
        <motion.div
          className="flex-1 overflow-y-auto p-6 bg-[#0f172a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Outlet />
        </motion.div>

      </div>
    </div>
  );
}

export default MainLayout;