import { NavLink } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconStethoscopeOff,
  IconUsers,
  IconCalendar,
  IconStethoscope,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function Sidebar() {
  const { role } = useSelector((state) => state.auth);

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-72 h-screen bg-[#0f172a] text-gray-300 flex flex-col justify-between p-5 shadow-2xl"
    >
      {/* TOP */}
      <div>
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          🏥<span>HMS</span>
        </h2>

        <nav className="space-y-2">

          {/* DASHBOARD (ALL) */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "hover:bg-[#1e293b]"
              }`
            }
          >
            <IconLayoutDashboard size={20} />
            Dashboard
          </NavLink>

          {/* ADMIN ONLY */}
          {role === "ADMIN" && (
            <>
        <NavLink to="/availability" className={({ isActive }) =>`flex items-center gap-3 px-4 py-3 rounded-lg 
         ${isActive ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white":"hover:bg-[#1e293b]"
            }`}><IconStethoscopeOff size={20} />DoctorAvailability</NavLink>

        <NavLink to="/patients" className={({ isActive }) =>`flex items-center gap-3 px-4 py-3 rounded-lg 
         ${isActive ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white":"hover:bg-[#1e293b]"
           }`}><IconUsers size={20} />Patients</NavLink>

        <NavLink to="/doctors" className={({ isActive }) =>`flex items-center gap-3 px-4 py-3 rounded-lg 
         ${ isActive? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white":"hover:bg-[#1e293b]"
           }`}><IconStethoscope size={20} />Doctors</NavLink>
            </>
          )}

          {/* USER */}
          {role === "USER" && (
            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    : "hover:bg-[#1e293b]"
                }`
              }
            >
              <IconStethoscope size={20} />
              Doctors
            </NavLink>
          )}

          {/* DOCTOR */}
          {role === "DOCTOR" && (
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    : "hover:bg-[#1e293b]"
                }`
              }
            >
              <IconCalendar size={20} />
              My Appointments
            </NavLink>
          )}

          {/* COMMON (ALL ROLES) */}
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "hover:bg-[#1e293b]"
              }`
            }
          >
            <IconCalendar size={20} />
            Appointments
          </NavLink>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1fad9f] to-[#67e1cf] flex items-center justify-center text-white font-bold">
            D
          </div>
          <div>
            <p className="text-sm text-white">Darshan</p>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <IconLogout size={18} />
          Logout
        </button>
      </div>
    </motion.div>
  );
}

export default Sidebar;