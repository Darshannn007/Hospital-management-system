/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authServices";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("PATIENT");

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
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
        phone: role === "PATIENT" ? formData.phone : null,

        education: role === "DOCTOR" ? formData.education : null,
        specialization: role === "DOCTOR" ? formData.specialization : null,
        experience: role === "DOCTOR" ? formData.experience : null,
      });

      toast.success("Registered successfully ✅");
      navigate("/");

    } catch (err) {
      console.log(err);
      toast.error("Registration failed ❌");
    }
  };

  return (
    <div className="h-screen flex">

      {/* LEFT */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 to-indigo-900 text-white flex flex-col justify-center px-16">
      <h1 className="text-4xl font-bold mb-4 absolute top-6 right-5 text-4xl font-bold select-none text-gray-400 text-shadow-blue-900 tracking-widest">HMS</h1>
      <h2 className="text-4xl font-bold absolute top-100 left-5 text-4xl font-bold select-none text-gray-400 text-shadow-yellow-500 tracking-widest">Create Account</h2>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow w-[420px]"
        >
          <h2 className="text-xl font-bold mb-4">Register</h2>

          {/* 🔥 ROLE TOGGLE */}
          <div className="flex mb-4 border rounded overflow-hidden">
            <button
              type="button"
              onClick={() => setRole("PATIENT")}
              className={`w-1/2 p-2 ${
                role === "PATIENT"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Patient
            </button>

            <button
              type="button"
              onClick={() => setRole("DOCTOR")}
              className={`w-1/2 p-2 ${
                role === "DOCTOR"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Doctor
            </button>
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded"
            required
          />

          {/* Confirm */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded"
            required
          />

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded"
            required
          />

          {/* 🔥 PATIENT FORM */}
          {role === "PATIENT" && (
            <>
              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleChange}
                className="w-full mb-3 p-3 border rounded"
                required
              />

              <select
                name="gender"
                onChange={handleChange}
                className="w-full mb-3 p-3 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="w-full mb-3 p-3 border rounded"
                required
              />
            </>
          )}

          {/* 🔥 DOCTOR FORM */}
          {role === "DOCTOR" && (
            <>
              <input
                type="text"
                name="education"
                placeholder="Education"
                onChange={handleChange}
                className="w-full mb-3 p-3 border rounded"
                required
              />

              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                onChange={handleChange}
                className="w-full mb-3 p-3 border rounded"
                required
              />

              <input
                type="text"
                name="experience"
                placeholder="Experience"
                onChange={handleChange}
                className="w-full mb-3 p-3 border rounded"
                required
              />
            </>
          )}

          <button className="w-full bg-blue-600 text-white p-3 rounded">
            Register
          </button>

          <p
            className="text-center mt-3 text-sm text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Already have an account? Login
          </p>
        </motion.form>
      </div>
    </div>
  );
}

export default Register;