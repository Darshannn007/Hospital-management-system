import { NavLink } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

function Sidebar() {
  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-75 bg-[#072c2b]/90 backdrop-blur-xl text-white p-6 shadow-xl"
    >
      <h2 className="text-2xl ml-4 font-extrabold font-stretch-150% mb-10 text-emerald-100">HMS</h2>

      <nav className="space-y-3">

        <NavLink to="/dashboard" className={({ isActive }) =>`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 
        ${isActive ? "bg-gradient-to-r from-[#1fad9f] to-[#32b9a9] shadow-lg": "hover:bg-white/10" }`}>
          <IconLayoutDashboard size={25} />
          Dashboard
        </NavLink>

        <NavLink to="/patients" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl 
        ${isActive ? "bg-gradient-to-r from-[#1fad9f] to-[#32b9a9]" : "hover:bg-white/10" }`} >
          <IconUsers size={25} />
          Patients
        </NavLink>

        <NavLink to="/appointments" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl 
        ${ isActive ? "bg-gradient-to-r from-[#1fad9f] to-[#32b9a9]": "hover:bg-white/10"}`}>
          <IconCalendar size={25} />
          Appointments
        </NavLink>

      </nav>
    </motion.div>
  );
}

export default Sidebar;