import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/Mainlayout";
import ProtectedRoute from "./ProtectedRoute";
import Patients from "../pages/Patients";
import Appoitments from "../pages/Appoitments";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients/>} />
          <Route path="/appointments" element={<Appoitments/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;