import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import bgImage from "../assets/hospital.jpg";
import { toast } from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 REAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const token = res.data;
      toast.success("Welcome!🙂")
      
      // Redux me save
      dispatch(
        loginSuccess({
          user: { email: formData.email },
          token: token,
        })
      );
      

      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-96 text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome, HMS
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none"
          required
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-[#1fad9f] to-[#67e1cf] p-3 rounded-lg font-semibold shadow-lg"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
}

export default Login;