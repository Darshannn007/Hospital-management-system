import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { 
  IconUser, 
  IconBell, 
  IconSearch, 
  IconSettings, 
  IconMenu2, 
  IconLogout,
  IconSun,
  IconMoon
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showProfile, setShowProfile] = useState(false);
  const { role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const demoNotifications = [
    {
      title: "New appointment request",
      message: "Dr. Sharma has accepted a follow-up slot for today.",
      time: "2m ago",
      tone: "from-cyan-500 to-cyan-700",
    },
    {
      title: "Payment received",
      message: "Invoice #204 has been marked as paid successfully.",
      time: "18m ago",
      tone: "from-teal-500 to-teal-700",
    },
    {
      title: "Prescription ready",
      message: "Your pharmacy order is packed and ready for pickup.",
      time: "1h ago",
      tone: "from-indigo-500 to-indigo-700",
    },
  ];

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
    <div className="flex h-screen overflow-hidden bg-slate-950/20 relative">
      
      {/* 🚀 Dynamic Floating Backdrop Blobs (Mesh Animation in Aquamarine/Teal) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[5%] right-[10%] w-137.5 bg-cyan-950/40 rounded-full blur-3xl animate-blob-float" />
        <div className="absolute bottom-[5%] left-[5%] w-150 bg-teal-950/40 rounded-full blur-3xl animate-blob-float [animation-delay:3s]" />
        <div className="absolute top-[35%] left-[30%] w-125 bg-indigo-950/30 rounded-full blur-3xl animate-blob-float [animation-delay:6s]" />
      </div>

      {/* 🚀 Sidebar Navigation Wrapper */}
      <div className="hidden md:block h-screen sticky top-0 shrink-0 z-20">
        <Sidebar />
      </div>

      {/* 🚀 Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-955/60 backdrop-blur-md z-40"
          onClick={handleCloseSidebar}
        />
      )}

      {/* 🚀 Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 md:hidden transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={handleCloseSidebar} />
      </div>

      {/* 🚀 Main Content Canvas */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative z-10">

        {/* 🚀 Top Navigation Header (Translucent Midnight Glass) */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          ref={headerRef}
          className="h-16 bg-white/20 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between border-b border-white/5 sticky top-0 z-20 shrink-0"
        >
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-300 hover:bg-white/5 rounded-xl transition-colors border border-white/10 bg-white/2"
            >
              <IconMenu2 size={20} />
            </motion.button>

            {/* Global Search box */}
            <div className="hidden md:flex items-center gap-2.5 bg-white/3 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 w-64 focus-within:w-72 focus-within:bg-white/6 focus-within:border-cyan-900/30 focus-within:ring-4 focus-within:ring-cyan-500 transition-all duration-300">
              <IconSearch size={16} className="text-slate-900" />
              <input 
                type="text" 
                placeholder="Search patient, doctor, invoice..." 
                className="bg-transparent search-input text-xs outline-none text-cyan-500 w-full"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 bg-white/3 text-slate-350 hover:text-slate-100 hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -120, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {theme === "dark" ? (
                  <IconSun size={18} className="text-cyan-400" />
                ) : (
                  <IconMoon size={18} className="text-slate-700" />
                )}
              </motion.div>
            </motion.button>

            {/* Notifications */}
            <div className="sm:relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setActiveDropdown((current) =>
                    current === "notifications" ? null : "notifications"
                  )
                }
                className="relative p-2.5 bg-white/3 text-slate-350 hover:text-slate-100 hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
              >
                <IconBell size={18} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-md">
                  3
                </span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 sm:right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl glass-card overflow-hidden z-50 p-1 shadow-2xl"
                  >
                    <div className="px-4 py-3 border-b hms-divider bg-white/2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Alerts & Notifications</p>
                    </div>

                    <div className="divide-y hms-divider max-h-72 overflow-y-auto">
                      {demoNotifications.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3.5 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer rounded-xl"
                        >
                          <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${item.tone} flex items-center justify-center text-white shadow-sm shrink-0`}>
                            <IconBell size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-slate-100 truncate">{item.title}</p>
                              <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-350 mt-0.5 leading-relaxed">{item.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Settings */}
            <div className="sm:relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setActiveDropdown((current) =>
                    current === "settings" ? null : "settings"
                  )
                }
                className="p-2.5 bg-white/3 text-slate-350 hover:text-slate-100 hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
              >
                <IconSettings size={18} />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "settings" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 sm:right-0 mt-3 w-48 rounded-2xl glass-card overflow-hidden z-50 p-1 shadow-2xl"
                  >
                    <div className="px-4 py-2 border-b hms-divider bg-white/2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Settings</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-rose-455 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <IconLogout size={16} />
                      <span className="uppercase tracking-wider">Logout Session</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10" />

            {/* Profile badge info */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2.5 bg-white/3 backdrop-blur-md pl-2 pr-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer text-left"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm bg-cyan-950/20 shadow-sm">
                  <IconUser size={16} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-450 rounded-full border-2 border-slate-950" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">Darshan</p>
                <p className="text-[9px] text-cyan-455 font-bold leading-none mt-1 tracking-wider uppercase">{role}</p>
              </div>
            </motion.button>

          </div>
        </motion.div>

        {/* 🚀 Main Page Canvas Container */}
        <div className={`flex-1 overflow-x-hidden overflow-y-auto z-10 relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          (activeDropdown !== null || showProfile) ? "blur-[6px] saturate-75 brightness-[0.7] pointer-events-none scale-[0.995]" : ""
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div 
            className="fixed inset-0 bg-slate-955/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-3xl w-full max-w-sm p-6 border border-white/10 text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 border border-cyan-500/20 rounded-xl flex items-center justify-center bg-cyan-950/10 text-cyan-400 font-bold text-lg shadow-sm">
                  👤
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">User Profile</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">HMS Registry ID</p>
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-4 text-xs">
                <div className="border-b border-white/5 pb-2.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Account Name</span>
                  <span className="font-extrabold text-white text-sm mt-0.5 block">Darshan</span>
                </div>
                <div className="border-b border-white/5 pb-2.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</span>
                  <span className="font-extrabold text-slate-300 text-xs mt-0.5 block">{user?.email || "admin@gmail.com"}</span>
                </div>
                <div className="border-b border-white/5 pb-2.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Assigned Role</span>
                  <span className="font-bold text-cyan-400 text-[10px] uppercase tracking-wider mt-0.5 inline-block px-2 py-0.5 rounded bg-cyan-950/20 border border-cyan-500/20">
                    {role}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Permissions Status</span>
                  <span className="font-bold text-emerald-450 text-[10px] uppercase tracking-wider mt-0.5 inline-block px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-500/20">
                    Full Administrator Access
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowProfile(false)}
                className="w-full mt-6 btn-teal-outline py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainLayout;