import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { IconBell, IconSearch, IconSettings } from "@tabler/icons-react";

function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* 🔥 Sidebar (fixed) */}
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* 🔥 Right Side */}
      <div className="flex-1 flex flex-col h-screen">

        {/* 🔥 Navbar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-16 bg-gradient-to-r from-blue-600
           via-indigo-700 to-purple-800 px-6 flex items-center justify-between shadow-lg sticky top-0 z-10 overflow-hidden"
        >
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 10, 0], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ x: [0, -10, 0], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 right-40 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"
            />
          </div>

          {/* Left Side - Search */}
          <div className="relative z-10 flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10"
            >
              <IconSearch size={18} className="text-blue-200" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent text-white placeholder-blue-200 text-sm outline-none w-48"
              />
            </motion.div>
          </div>

          {/* Right Side - Actions */}
          <div className="relative z-10 flex items-center gap-4">
            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
            >
              <IconBell size={20} className="text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
            >
              <IconSettings size={20} className="text-white" />
            </motion.button>

            {/* Divider */}
            <div className="h-8 w-px bg-white/20" />

            {/* User Profile */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm pl-3 pr-4 py-1.5 rounded-xl border border-white/10 cursor-pointer"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold shadow-lg">
                  D
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-700"
                />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">Darshan</p>
                <p className="text-xs text-blue-200">Admin</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 🔥 Scrollable Content */}
        <motion.div
          className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100"
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