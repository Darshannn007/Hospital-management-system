/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconStethoscopeOff,
  IconUsers,
  IconUser,
  IconCalendar,
  IconStethoscope,
  IconLogout,
  IconChevronRight,
  IconFileInvoice,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function Sidebar({ onClose }) {
  const { role } = useSelector((state) => state.auth);

  const floatingAnimation = {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.3 + i * 0.1, duration: 0.4 },
    }),
  };

  const NavItem = ({ to, icon: Icon, label, index }) => (
    <motion.div
      custom={index}
      variants={navItemVariants}
      initial="hidden"
      animate="visible"
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
            isActive
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
              : "text-blue-100 hover:bg-white/10 hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className={`p-2 rounded-lg ${
                isActive
                  ? "bg-white/20"
                  : "bg-white/5 group-hover:bg-white/10"
              }`}
            >
              <Icon size={20} />
            </motion.div>
            <span className="font-medium">{label}</span>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-auto"
              >
                <IconChevronRight size={16} />
              </motion.div>
            )}
            {!isActive && (
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-0.5 bg-white/50 rounded-full"
              />
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );

  let navIndex = 0;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-72 h-screen bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 text-white flex flex-col justify-between p-5 shadow-2xl overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, y: [10, -10, 10] }}
          className="absolute top-1/3 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, y: [-5, 15, -5] }}
          className="absolute bottom-20 left-10 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"
        />
      </div>

      {/* TOP */}
      <div className="relative z-10">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl">🏥</span>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">
                HMS
              </h2>
              <p className="text-xs text-blue-200">Healthcare System</p>
            </div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="h-px bg-linear-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>

        {/* Navigation Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs uppercase tracking-wider text-blue-200/70 mb-4 px-2 font-medium"
        >
          Menu
        </motion.p>

        {/* Nav Items */}
        <nav className="space-y-2">
          <NavItem to="/dashboard" icon={IconLayoutDashboard} label="Dashboard" index={navIndex++} />

          {role === "ADMIN" && (
            <>
              <NavItem to="/availability" icon={IconStethoscopeOff} label="Doctor Availability" index={navIndex++} />
              <NavItem to="/patients" icon={IconUsers} label="Patients" index={navIndex++} />
              <NavItem to="/doctors" icon={IconStethoscope} label="Doctors" index={navIndex++} />
              <NavItem to="/billing" icon={IconFileInvoice} label="Billing" index={navIndex++} />
            </>
          )}

          {role === "PATIENT" && (
            <>
              <NavItem to="/doctors" icon={IconStethoscope} label="Doctors" index={navIndex++} />
              <NavItem to="/billing" icon={IconFileInvoice} label="My Invoices" index={navIndex++} />
            </>
          )}

          {role === "DOCTOR" && (
            <NavItem to="/appointments" icon={IconCalendar} label="My Appointments" index={navIndex++} />
          )}

          <NavItem to="/appointments" icon={IconCalendar} label="Appointments" index={navIndex++} />
        </nav>
      </div>

      {/* BOTTOM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative z-10"
      >
        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-4" />

        {/* User Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <IconUser className="w-9 h-9 px-1 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold shadow-lg">
                
              </IconUser>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-500"
              />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Darshan</p>
              <p className="text-xs text-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                {role}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ rotate: -10 }}
            className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
          >
            <IconLogout size={18} />
          </motion.div>
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;