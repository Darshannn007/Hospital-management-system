import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Appointments from "../pages/Appoitments";
import Doctors from "../pages/Doctor";
import Billing from "../pages/Billing";
import Pharmacy from "../pages/Pharmacy";
import Prescription from "../pages/Prescription";
import Invoice from "../pages/Invoice";
import Reports from "../pages/Reports";
import Availability from "../pages/Availability";
import Register from "../pages/Register";

// Layout
import MainLayout from "../layouts/Mainlayout";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 Protected Layout */}
        <Route element={<MainLayout />}>

          {/* 🏠 Dashboard (All roles) */}
          <Route
            path="/dashboard" 
            element={
               <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 👨‍⚕️ Patients → ADMIN + DOCTOR */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
                <Patients />
              </ProtectedRoute>
            }
          />

          {/* 🩺 Doctors → ADMIN + USER */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "PATIENT"]}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
              path="/availability"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Availability />
                </ProtectedRoute>
              }
            />

          {/* 📅 Appointments → ALL */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR", "PATIENT"]}>
                <Appointments />
              </ProtectedRoute>
            }
          />

          {/* 💰 Billing → ADMIN */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Billing />
              </ProtectedRoute>
            }
          />

          {/* 💊 Pharmacy → ADMIN */}
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Pharmacy />
              </ProtectedRoute>
            }
          />

          {/* 📄 Prescription → DOCTOR */}
          <Route
            path="/prescription"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <Prescription />
              </ProtectedRoute>
            }
          />

          {/* 🧾 Invoice → ADMIN */}
          <Route
            path="/invoice"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Invoice />
              </ProtectedRoute>
            }
          />

          {/* 📊 Reports → ADMIN */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;