import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { IconUser, IconBell, IconSearch, IconSettings, IconMenu2, IconLogout } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const {role} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const demoNotifications = [
    {
      title: "New appointment request",
      message: "Dr. Sharma has accepted a follow-up slot for today.",
      time: "2m ago",
      tone: "from-blue-500 to-indigo-600",
    },
    {
      title: "Payment received",
      message: "Invoice #204 has been marked as paid successfully.",
      time: "18m ago",
      tone: "from-emerald-500 to-teal-600",
    },
    {
      title: "Prescription ready",
      message: "Your pharmacy order is packed and ready for pickup.",
      time: "1h ago",
      tone: "from-purple-500 to-pink-600",
    },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* 🔥 Sidebar (fixed) - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* 🔥 Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* 🔥 Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 md:hidden transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={handleCloseSidebar} />
      </div>

      {/* 🔥 Right Side */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">

        {/* 🔥 Navbar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          ref={headerRef}
          className="relative h-16 bg-linear-to-r from-blue-600 via-indigo-700 to-purple-800 px-4 md:px-6 flex items-center justify-between shadow-lg top-0 z-20 overflow-visible"
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

          {/* Left Side - Hamburger + Search */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Hamburger Menu - Mobile Only */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
            >
              <IconMenu2 size={22} className="text-white" />
            </motion.button>

            {/* Search - Hidden on mobile */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10"
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
          <div className="relative z-10 flex items-center gap-3 md:gap-4 flex-nowrap shrink-0">
            {/* Notification Bell */}
            <div className="relative shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setActiveDropdown((current) =>
                    current === "notifications" ? null : "notifications"
                  )
                }
                className="relative p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
              >
                <IconBell size={20} className="text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  3
                </span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="fixed top-16 left-3 right-3 w-auto max-w-none sm:absolute sm:top-full sm:mt-3 sm:left-auto sm:right-0 sm:w-72 md:w-80 sm:max-w-[calc(100vw-1rem)] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
                      <p className="text-sm font-semibold text-gray-800">Notifications</p>
                      <p className="text-xs text-gray-500">Demo alerts for HMS activity</p>
                    </div>

                    <div className="max-h-[calc(100vh-9rem)] overflow-y-auto">
                      {demoNotifications.map((item) => (
                        <div
                          key={item.title}
                          className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.tone} flex items-center justify-center text-white shadow-lg shrink-0`}>
                            <IconBell size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                              <span className="text-[11px] text-gray-400 shrink-0">{item.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <div className="relative shrink-0">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() =>
                  setActiveDropdown((current) =>
                    current === "settings" ? null : "settings"
                  )
                }
                className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors"
              >
                <IconSettings size={20} className="text-white" />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "settings" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="fixed top-16 left-3 right-3 w-auto sm:absolute sm:top-full sm:mt-3 sm:left-auto sm:right-0 sm:w-56 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-gray-50 to-blue-50">
                      <p className="text-sm font-semibold text-gray-800">Quick Settings</p>
                      <p className="text-xs text-gray-500">Account and session actions</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <IconLogout size={16} />
                      </span>
                      <span className="flex-1">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/20 shrink-0" />

            {/* User Profile */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm pl-3 pr-4 py-1.5 rounded-xl border border-white/10 cursor-pointer shrink-0"
            >
              <div className="relative">
                <IconUser className="w-9 h-9 px-1 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold shadow-lg">
                
                </IconUser>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-700"
                />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">Darshan</p>
                <p className="text-xs text-blue-200">{role}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 🔥 Scrollable Content */}
        <motion.div
          className="flex-1 overflow-x-hidden overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100"
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