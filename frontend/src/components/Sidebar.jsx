/* eslint-disable no-unused-vars */
import { memo, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
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
  IconMedicineSyrup,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar({ onClose }) {
  const { role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    if (onClose) onClose();
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `group relative flex items-center gap-3.5 px-4.5 py-3 rounded-xl transition-all duration-350 border ${
          isActive
            ? "active-nav-outline text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.12)]"
            : "border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`transition-colors ${
              isActive
                ? "text-cyan-400 animate-pulse"
                : "text-slate-400 group-hover:text-slate-100"
            }`}
          >
            <Icon size={18} />
          </div>

          <span className="font-bold text-xs tracking-wider uppercase">
            {label}
          </span>

          {isActive && (
            <motion.div
              layoutId="sidebarActiveIndicator"
              className="ml-auto text-cyan-400"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <IconChevronRight size={14} className="stroke-[3]" />
            </motion.div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="relative w-75 h-screen glass-sidebar text-slate-200 flex flex-col p-5 shadow-2xl overflow-hidden select-none shrink-0 z-30">
      
      {/* Dynamic backdrop glows peaking through the glass sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-12 w-36 h-36 bg-teal-500 rounded-full blur-3xl" />
      </div>

      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* Header Branding */}
        <div className="mb-6 pt-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <span className="text-xl">🏥</span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest uppercase teal-gradient-text">
                HMS
              </h2>
              <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
                Hospital Management System
              </p>
            </div>
          </div>
          <div className="h-px bg-white/10" />
        </div>

        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3.5 px-2.5 font-bold">
          Navigation
        </p>

        {/* Navigation items list */}
        <nav className="space-y-1.5 flex-1 pr-1 overflow-y-auto sidebar-scrollbar">
          
          <NavItem
            to="/dashboard"
            icon={IconLayoutDashboard}
            label="Dashboard"
          />

          {/* ADMIN */}
          {role === "ADMIN" && (
            <>
              <NavItem
                to="/availability"
                icon={IconStethoscopeOff}
                label="Doc Availability"
              />
              <NavItem
                to="/patients"
                icon={IconUsers}
                label="Patients Registry"
              />
              <NavItem
                to="/doctors"
                icon={IconStethoscope}
                label="Doctors Directory"
              />
              <NavItem
                to="/billing"
                icon={IconFileInvoice}
                label="Billing Ledger"
              />
              <NavItem
                to="/pharmacy"
                icon={IconMedicineSyrup}
                label="Pharmacy Stocks"
              />
            </>
          )}

          {/* PATIENT */}
          {role === "PATIENT" && (
            <>
            <NavItem
                to="/appointments"
                icon={IconCalendar}
                label="My Bookings"
              />
              <NavItem
                to="/doctors"
                icon={IconStethoscope}
                label="Find Doctors"
              />
              <NavItem
                to="/billing"
                icon={IconFileInvoice}
                label="My Invoices"
              />
            </>
          )}

          {/* DOCTOR */}
          {role === "DOCTOR" && (
            <NavItem
              to="/appointments"
              icon={IconCalendar}
              label="My Schedule"
            />
          )}

          {/* Common fallback */}
          {role !== "PATIENT" && (
            <NavItem
              to="/appointments"
              icon={IconCalendar}
              label="Appointments"
            />
          )}

        </nav>
      </div>

      {/* User Section at bottom */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        
        {/* Clickable Profile Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProfile(true)}
          className="w-full bg-white/5 border border-white/5 rounded-2xl p-3.5 mb-3.5 cursor-pointer text-left block"
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs bg-cyan-950/20 shadow-sm">
                <IconUser size={15} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">Darshan</p>
              <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">{role}</p>
            </div>
          </div>
        </motion.button>

        {/* Logout trigger */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group border border-transparent"
        >
          <IconLogout size={16} className="text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span className="font-bold text-xs tracking-wider uppercase">Logout Session</span>
        </button>

      </div>

      {/* Glassmorphic User Profile Modal */}
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

export default memo(Sidebar);