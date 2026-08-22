/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { login, warmupBackend } from "../services/authServices";

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

  useEffect(() => {
    warmupBackend().catch((err) => {
      console.debug("Backend warmup failed", err);
    });

    // Force dark theme on login page
    document.documentElement.classList.add("dark");

    return () => {
      const savedTheme = localStorage.getItem("theme") || "dark";
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      const { token, email, role } = res.data;
      toast.success("Welcome back! 🙂");
      


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
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password, roleLabel) => {
    const demoData = { email, password };
    setFormData(demoData);

    // Short delay for visual feedback of autofill
    setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await login(demoData);
        const { token, email: resEmail, role } = res.data;

        dispatch(
          loginSuccess({
            user: { email: resEmail },
            token,
            role,
          })
        );

        toast.success(`Logged in as Demo ${roleLabel} 🚀`);
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        toast.error("Demo login failed ❌");
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleDemoAdminLogin = () => {
    handleDemoLogin("admin@gmail.com", "1234", "Admin");
  };

  const handleDemoPatientLogin = () => {
    handleDemoLogin("patient1@gmail.com", "1234", "Patient");
  };

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const features = [
    { icon: "🔐", text: "Role-Based Access Control (RBAC)" },
    { icon: "📅", text: "Real-Time Appointment Scheduling" },
    { icon: "🧾", text: "Automated Billing & Digital Receipts" },
    { icon: "💊", text: "Pharmacy Inventory Stock Tracking" },
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-transparent overflow-hidden text-slate-200 select-none">
      
      {/* LEFT SIDE - Info Panel (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex relative w-1/2 h-full flex-col justify-center px-12 xl:px-20 overflow-hidden border-r border-white/5 shrink-0">
        
        {/* Abstract Glowing Aura Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob-float" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-blob-float [animation-delay:2s]" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob-float [animation-delay:4s]" />
        </div>

        {/* Brand/Logo Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-6"
        >
          <motion.div
            indigo-brand="true"
            className="inline-flex items-center gap-3 bg-white/3 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm w-fit"
          >
            <span className="text-xl">🏥</span>
            <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">HMS v2.0 Enterprise</span>
          </motion.div>

          <div className="space-y-3">
            <motion.h1
              variants={itemVariants}
              className="text-4xl xl:text-5xl font-black leading-tight text-white uppercase tracking-tight"
            >
              Healthcare Management, <br />
              <span className="teal-gradient-text">Elevated.</span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm"
            >
              A robust, role-based platform designed to optimize medical workflows, billing registry, and patient check-ins seamlessly.
            </motion.p>
          </div>

          {/* Feature Showcase Grid */}
          <motion.div variants={itemVariants} className="pt-4 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-455">Core Modules</h3>
            <div className="grid grid-cols-1 gap-2.5 max-w-md">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 bg-white/2 border border-white/5 px-4 py-3 rounded-2xl cursor-default transition-all duration-300"
                >
                  <span className="text-xl bg-white/5 p-1.5 rounded-xl border border-white/5 shrink-0">{feature.icon}</span>
                  <span className="text-xs font-bold text-slate-350 tracking-wide">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* RIGHT SIDE - Form Panel */}
      <div className="flex-1 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        
        {/* Soft Background Globs for Right Side */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Login Form Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md glass-card p-6 rounded-3xl border border-white/10 relative z-10 max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-md shrink-0">
              <span className="text-xl">👋</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Welcome Back</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sign in to access your healthcare portal</p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-455 text-xs p-3.5 rounded-xl mb-4 font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-[9px] font-black text-slate-450 uppercase tracking-widest block mb-1.5">
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

            {/* Password Field */}
            <div>
              <label className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-455">🔒</span>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-teal-outline py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="hms-spinner w-4 h-4 border-2"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Segment */}
          <div className="mt-6 border-t border-white/5 pt-5">
            <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest mb-3">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="bg-white/2 border border-white/10 hover:bg-white/5 text-cyan-400 hover:text-cyan-300 py-3 rounded-xl font-bold text-[10px] uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                💼 Admin Portal
              </button>
              <button
                type="button"
                onClick={handleDemoPatientLogin}
                className="bg-white/2 border border-white/10 hover:bg-white/5 text-cyan-400 hover:text-cyan-300 py-3 rounded-xl font-bold text-[10px] uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                🏥 Patient Portal
              </button>
            </div>
          </div>

          {/* Navigation link to Register */}
          <p className="text-[11px] mt-5 text-center text-slate-400 font-medium">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-cyan-400 font-bold hover:text-cyan-300 cursor-pointer transition-colors ml-1 uppercase tracking-wider"
            >
              Register Now
            </span>
          </p>

        </motion.div>
      </div>

    </div>
  );
}

export default Login;
