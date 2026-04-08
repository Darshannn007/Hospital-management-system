/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      const { token, email, role } = res.data;
      toast.success("Welcome! 🙂");

      dispatch(
        loginSuccess({
          user: { email },
          token: token,
          role: role,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Invalid email or password ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.6 + i * 0.1, duration: 0.5 },
    }),
  };

  const floatingAnimation = {
    y: [-5, 5, -5],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const features = [
    { icon: "🔐", text: "Role-based Access Control" },
    { icon: "📊", text: "Real-time Patient Tracking" },
    { icon: "📅", text: "Appointment Management" },
    { icon: "💊", text: "Billing & Pharmacy" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT SIDE - Animated Background (Hidden on mobile) */}
      <motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex relative w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white flex-col justify-center px-8 lg:px-16 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ ...floatingAnimation, y: [10, -10, 10] }}
            className="absolute bottom-32 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ ...floatingAnimation, y: [-5, 15, -5] }}
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"
          />
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          {/* Logo/Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <span className="text-2xl">🏥</span>
            <span className="text-sm font-medium tracking-wide">HMS v2.0</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent"
          >
            Hospital Management System
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg mb-12 text-blue-100 font-light italic"
          >
            "Care is always better than cure"
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-semibold mb-4 leading-tight"
          >
            Manage Your Hospital
            <br />
            <span className="text-blue-300">Smarter & Better</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-blue-100 mb-8 max-w-md leading-relaxed"
          >
            A complete solution for managing patients, doctors, appointments,
            billing and pharmacy — all in one place.
          </motion.p>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.text}
                custom={i}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl w-fit cursor-default"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-blue-50">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-50 relative px-4 py-8 lg:px-0 lg:py-0">
        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-4 right-4 lg:top-6 lg:right-8 text-lg lg:text-2xl font-bold text-gray-400 tracking-widest select-none"
        >
          Darshan Desale
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl shadow-blue-500/10 w-full max-w-[420px] border border-gray-100"
        >
          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30"
            >
              <span className="text-3xl">👋</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500">Sign in to access your dashboard</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-5"
          >
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Email Address
            </label>
            <div
              className={`relative transition-all duration-300 ${
                focusedField === "email" ? "scale-[1.02]" : ""
              }`}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Password
            </label>
            <div
              className={`relative transition-all duration-300 ${
                focusedField === "password" ? "scale-[1.02]" : ""
              }`}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm mt-6 text-center text-gray-600"
          >
            Don't have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-blue-600 font-semibold cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => navigate("/register")}
            >
              Register Now
            </motion.span>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}

export default Login;