import { useState } from "react";
import { motion } from "framer-motion";
import { addPatient } from "../services/patientService";

function AddPatientForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await addPatient(formData); // 🔥 API call
      onClose(); // popup close
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-[400px]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Add Patient</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="gender"
          placeholder="Gender"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button className="bg-[#1fad9f] text-white px-4 py-2 rounded active:scale-90 transition-shadow">
            Save
          </button>
        </div>
      </motion.form>
    </div>
  );
}

export default AddPatientForm;