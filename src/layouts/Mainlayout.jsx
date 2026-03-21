import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

function MainLayout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#eef2ff] via-[#f0fdfa] to-[#ecfeff]">

        {/* Navbar */}
        <div className="h-16 bg-white/60 backdrop-blur-xl border-b border-white/30 px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-semibold text-gray-700">
            Dashboard
          </h1>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1fad9f] to-[#67e1cf] flex items-center justify-center text-white font-bold shadow-md">
            D
          </div>
        </div>

        {/* Page Content */}
        <motion.div
          className="p-6 flex-1"
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