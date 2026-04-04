/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { login } from "../services/authServices";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      const {token, email, role } = res.data;
      toast.success("Welcome!🙂");

      dispatch(
        loginSuccess({
          user: {email},
          token: token,
          role: role, 
        }));

        navigate("/dashboard");
        

      // localStorage.setItem("token",token); ---> this task is already done in authslice
      // localStorage.setItem("role",role);
    } catch (err) {
      console.log(err);
      toast.error("Invalid email or password ❌");
    }};

  return (
    <div className="h-screen w-full flex">
      
      
      {/* LEFT SIDE */}
      <div className="relative w-1/2 bg-linear-to-br from-blue-500 to-indigo-900 text-white flex flex-col justify-center px-16">
      
        
        <h1 className="text-4xl font-bold mb-4 text-gray-400">
          HOSPITAL MANAGEMENT SYSTEM
        </h1>

        <p className="mb-20 text-gray-100">
        CARE IS ALWAYS BETTER THAN CURE
        </p>

        <h2 className="text-4xl text-gray-400 font-bold mb-6 leading-tight">
          Manage Your Hospital <br /> Smarter & Better
        </h2>

        <p className="text-gray-200  mb-3">
          A complete solution for managing patients, doctors,
          appointments, billing and pharmacy — all in one place.
        </p>

        <ul className="space-y-3 text-gray-100">
          <li>• Role-based Access Control</li>
          <li>• Real-time Patient Tracking</li>
          <li>• Appointment Management</li>
          <li>• Billing & Pharmacy</li>
        </ul>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
      <h1 className="absolute top-6 right-5 text-4xl font-bold select-none text-gray-400 text-shadow-blue-900 tracking-widest">
    Darshan Desale
     </h1>
        
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-[400px]"
        >
          <h2 className="text-2xl font-bold mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6">
            Sign in to access your dashboard
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}

          {/* Email */}
          <label className="text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full  mb-4 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <label className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-6 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-linear-to-br from-blue-500 to-indigo-900 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </motion.button>
        </motion.form>
      </div>
      <p className="text-sm mt-4 text-center absolute bottom-45 right-55 transform -translate-x-1/2">
        Don't have an account?{" "}
      <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>
       Register
      </span>
      </p>
    </div>
  );
}

export default Login;