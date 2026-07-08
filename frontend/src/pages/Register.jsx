/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("PATIENT");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    // Force dark theme on register page
    document.documentElement.classList.add("dark");

    return () => {
      const savedTheme = localStorage.getItem("theme") || "dark";
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);

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
        phone: formData.phone,
        education: role === "DOCTOR" ? formData.education : null,
        specialization: role === "DOCTOR" ? formData.specialization : null,
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

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const benefits = [
    { icon: "🏥", text: "Direct portal access to your health stats" },
    { icon: "📅", text: "Instant appointment booking with specialists" },
    { icon: "💊", text: "Download digital prescriptions & invoice receipts" },
    { icon: "🔒", text: "Fully secure HIPAA-compliant records" },
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-transparent overflow-hidden text-slate-200 select-none">
      
      {/* LEFT SIDE - Info Panel (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex relative w-1/2 h-full flex-col justify-center px-12 xl:px-20 overflow-hidden border-r border-white/5 shrink-0">
        
        {/* Abstract Glowing Aura Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob-float" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-blob-float [animation-delay:2s]" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob-float [animation-delay:4s]" />
        </div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-6"
        >
          {/* Logo/Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-white/3 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm w-fit"
          >
            <span className="text-lg">🏥</span>
            <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">HMS v2.0</span>
          </motion.div>

          <div className="space-y-3">
            <motion.h1
              variants={itemVariants}
              className="text-4xl xl:text-5xl font-black leading-tight text-white uppercase tracking-tight"
            >
              Join Our Patient & <br />
              <span className="teal-gradient-text">Doctor Network</span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm"
            >
              Create your account to start managing appointments, digital prescriptions, and inventory logs.
            </motion.p>
          </div>

          {/* Benefits Grid */}
          <motion.div variants={itemVariants} className="pt-4 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-455">Benefits</h3>
            <div className="grid grid-cols-1 gap-2.5 max-w-md">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 bg-white/2 border border-white/5 px-4 py-3 rounded-2xl cursor-default transition-all duration-300"
                >
                  <span className="text-lg bg-white/5 p-1.5 rounded-xl border border-white/5 shrink-0">{benefit.icon}</span>
                  <span className="text-xs font-bold text-slate-350 tracking-wide">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* RIGHT SIDE - Form Panel */}
      <div className="flex-1 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        
        {/* Soft Background Globs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Register Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg glass-card p-6 rounded-3xl border border-white/10 relative z-10 max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-md shrink-0">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Create Account</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Get started by creating your account</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="mb-4">
            <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1.5">
              Select Your Role
            </label>
            <div className="flex gap-2 p-1 bg-white/2 border border-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                  role === "PATIENT"
                    ? "bg-cyan-950/20 text-cyan-400 border-cyan-500/20 shadow-md"
                    : "text-slate-455 hover:text-slate-200 border-transparent"
                }`}
              >
                <span>🧑‍🦱</span> Patient
              </button>

              <button
                type="button"
                onClick={() => setRole("DOCTOR")}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                  role === "DOCTOR"
                    ? "bg-cyan-950/20 text-cyan-400 border-cyan-500/20 shadow-md"
                    : "text-slate-455 hover:text-slate-200 border-transparent"
                }`}
              >
                <span>👨‍⚕️</span> Doctor
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Row 1: Full Name */}
            <div>
              <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-450">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-450">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-450">📱</span>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 99999 88888"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-450">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-455">🔐</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Role Fields */}
            <AnimatePresence mode="wait">
              {role === "PATIENT" && (
                <motion.div
                  key="patient-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                        Age
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-450">🎂</span>
                        <input
                          type="number"
                          name="age"
                          placeholder="25"
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                        Gender
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm z-10 text-slate-455">⚧️</span>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full pl-11 pr-8 py-3 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer appearance-none focus:border-cyan-500"
                          required
                        >
                          <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                          <option value="Male" className="bg-slate-900 text-slate-200">Male</option>
                          <option value="Female" className="bg-slate-900 text-slate-200">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {role === "DOCTOR" && (
                <motion.div
                  key="doctor-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1">
                        Education
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-455">🎓</span>
                        <input
                          type="text"
                          name="education"
                          placeholder="MBBS, MD Cardiology"
                          value={formData.education}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1">
                        Specialization
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-455">🩺</span>
                        <input
                          type="text"
                          name="specialization"
                          placeholder="Cardiologist"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1">
                      Experience (Years)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-455">📅</span>
                      <input
                        type="text"
                        name="experience"
                        placeholder="8 years"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-teal-outline py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="hms-spinner w-4 h-4 border-2"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </form>

          {/* Navigation link to Login */}
          <p className="text-[11px] mt-4 text-center text-slate-400 font-medium">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-cyan-400 font-bold hover:text-cyan-300 cursor-pointer transition-colors ml-1 uppercase tracking-wider"
            >
              Sign In
            </span>
          </p>

        </motion.div>
      </div>

    </div>
  );
}

export default Register;