import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Protected Route & Layout
import MainLayout from "../layouts/Mainlayout";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded Pages (Code-Splitting)
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Patients = lazy(() => import("../pages/Patients"));
const Appointments = lazy(() => import("../pages/Appoitments"));
const Doctors = lazy(() => import("../pages/Doctor"));
const Availability = lazy(() => import("../pages/Availability"));
const Billing = lazy(() => import("../pages/Billing"));
const Pharmacy = lazy(() => import("../pages/Pharmacy"));

// Global Full-Screen Loader Fallback
const PageLoader = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#070812] select-none text-slate-200">
    <div className="hms-spinner w-10 h-10 border-4 border-cyan-500/10 border-left-cyan-500 rounded-full animate-spin"></div>
    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mt-4 animate-pulse">Loading Portal...</span>
  </div>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* 🔓 Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Protected Layout */}
          <Route element={<MainLayout />}>

            {/* 🏠 Dashboard (All roles) */}
            <Route path="/dashboard"  
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

            {/* 👨‍⚕️ Patients → ADMIN + DOCTOR */}
            <Route path="/patients"
              element={<ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
                  <Patients /></ProtectedRoute>}/>

            {/* 🩺 Doctors → ADMIN + USER */}
            <Route path="/doctors"
              element={<ProtectedRoute allowedRoles={["ADMIN", "PATIENT"]}>
                  <Doctors /></ProtectedRoute>}/>
            <Route path="/availability"
                element={<ProtectedRoute allowedRoles={["ADMIN"]}>
                    <Availability /></ProtectedRoute>}/>

            {/* 📅 Appointments → ALL */}
            <Route path="/appointments"
              element={<ProtectedRoute allowedRoles={["ADMIN", "DOCTOR", "PATIENT"]}><Appointments /></ProtectedRoute>}/>

            {/* 💰 Billing → ADMIN + PATIENT */}
            <Route path="/billing"
              element={<ProtectedRoute allowedRoles={["ADMIN", "PATIENT"]}>
                  <Billing /></ProtectedRoute>}/>

            {/* 💊 Pharmacy → ADMIN */}
            <Route path="/pharmacy"
              element={<ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Pharmacy /></ProtectedRoute>}/>

          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;