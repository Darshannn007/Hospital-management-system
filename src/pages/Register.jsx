/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("PATIENT");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    education: "",
    specialization: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: role,
        name: formData.name,
        age: role === "PATIENT" ? Number(formData.age) : null,
        gender: role === "PATIENT" ? formData.gender : null,
        phone:formData.phone,
        education: role === "DOCTOR" ? formData.education : null,
        specialization: role === "DOCTOR" ? formData.specialization:null,
        experience: role === "DOCTOR" ? formData.experience : null,
      });

      toast.success("Registered successfully ✅");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Registration failed ❌");
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

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const inputClass = (fieldName) =>
    `w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white ${
      focusedField === fieldName ? "scale-[1.02]" : ""
    }`;

  const benefits = [
    { icon: "🏥", text: "Access quality healthcare" },
    { icon: "📋", text: "Manage appointments easily" },
    { icon: "💊", text: "Track prescriptions" },
    { icon: "🔒", text: "Secure & private data" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT SIDE - Animated Background (Hidden on mobile) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex relative w-full lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white flex-col justify-center px-8 lg:px-16 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ ...floatingAnimation, y: [10, -10, 10] }}
            className="absolute bottom-32 right-20 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ ...floatingAnimation, y: [-5, 15, -5] }}
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ ...floatingAnimation, y: [15, -5, 15] }}
            className="absolute top-1/4 right-10 w-20 h-20 bg-indigo-300/10 rounded-full blur-lg"
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
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
          >
            Join Our Healthcare Network
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg mb-8 text-purple-100 font-light max-w-md"
          >
            Create your account and get access to comprehensive healthcare
            management tools.
          </motion.p>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl w-fit cursor-default"
              >
                <span className="text-xl">{benefit.icon}</span>
                <span className="text-purple-50">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-purple-200 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-purple-200 text-sm">Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-purple-200 text-sm">Support</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 relative px-4 py-8 lg:px-0">
        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-4 right-4 lg:top-6 lg:right-8 text-lg lg:text-2xl font-bold text-gray-300 tracking-widest select-none"
        >
          Darshan Desale
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-purple-500/10 w-full max-w-[450px] border border-gray-100 max-h-[90vh] overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30"
            >
              <span className="text-2xl">✨</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">
              Join us and start your journey
            </p>
          </motion.div>

          {/* Role Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mb-5"
          >
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              I am a
            </label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <motion.button
                type="button"
                onClick={() => setRole("PATIENT")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === "PATIENT"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>🧑‍🦱</span> Patient
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setRole("DOCTOR")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === "DOCTOR"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>👨‍⚕️</span> Doctor
              </motion.button>
            </div>
          </motion.div>

          {/* Common Fields */}
          <div className="space-y-4">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass("email")}
                  required
                />
              </div>
            </motion.div>

            {/* Password Row */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass("password")}
                  required
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔐
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm"
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass("confirmPassword")}
                  required
                />
              </div>
            </motion.div>

            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  👤
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass("name")}
                  required
                />
              </div>
            </motion.div>

            {/* Patient Fields */}
            <AnimatePresence mode="wait">
              {role === "PATIENT" && (
                <motion.div
                  key="patient-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        🎂
                      </span>
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        onChange={handleChange}
                        onFocus={() => setFocusedField("age")}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass("age")}
                        required
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                        ⚧️
                      </span>
                      <select
                        name="gender"
                        onChange={handleChange}
                        onFocus={() => setFocusedField("gender")}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass("gender")} appearance-none cursor-pointer`}
                        required
                      >
                        <option value="">Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      📱
                    </span>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass("phone")}
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Doctor Fields */}
              {role === "DOCTOR" && (
                <motion.div
                  key="doctor-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🎓
                    </span>
                    <input
                      type="text"
                      name="education"
                      placeholder="Education (e.g., MBBS, MD)"
                      onChange={handleChange}
                      onFocus={() => setFocusedField("education")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass("education")}
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🩺
                    </span>
                    <input
                      type="text"
                      name="specialization"
                      placeholder="Specialization"
                      onChange={handleChange}
                      onFocus={() => setFocusedField("specialization")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass("specialization")}
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      📅
                    </span>
                    <input
                      type="text"
                      name="experience"
                      placeholder="Years of Experience"
                      onChange={handleChange}
                      onFocus={() => setFocusedField("experience")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass("experience")}
                      required
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      📱
                    </span>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass("phone")}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⏳
                  </motion.span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    🚀
                  </motion.span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm mt-5 text-center text-gray-600"
          >
            Already have an account?{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-indigo-600 font-semibold cursor-pointer hover:text-purple-600 transition-colors"
              onClick={() => navigate("/")}
            >
              Sign In
            </motion.span>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}

export default Register;