import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addPatient, updatePatient } from "../services/patientService";
import { toast } from "react-hot-toast";

function AddPatientForm({ onClose, editPatient }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
      if (editPatient && editPatient.id) {
        await updatePatient(editPatient.id, formData);
        toast.success("Patient updated successfully! ✅");
      } else {
        await addPatient(formData);
        toast.success("Patient registered successfully! ✅");
      }
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save patient record ❌");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (editPatient) {
      setFormData(editPatient);
    }
  }, [editPatient]);

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.form
        initial={{ scale: 0.85, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 15, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 rounded-3xl w-full max-w-sm space-y-5 text-slate-200"
      >
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            {editPatient ? "Edit Patient Record" : "Add New Patient"}
          </h2>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
            HMS Registry Module
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter patient full name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
                required
              >
                <option value="" className="bg-slate-900 text-slate-400">Gender</option>
                <option value="Male" className="bg-slate-900 text-slate-200">Male</option>
                <option value="Female" className="bg-slate-900 text-slate-200">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 btn-teal-outline rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            {isLoading ? "Saving..." : "Save Record"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}

export default AddPatientForm;