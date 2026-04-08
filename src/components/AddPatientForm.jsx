import {useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addPatient } from "../services/patientService";
import { updatePatient } from "../services/patientService";
import { toast } from "react-hot-toast";

function AddPatientForm({ onClose, editPatient }) {
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
  
    console.log("🔥 Data bhej rahe hain backend ko:", formData);

    try {
      if (editPatient && editPatient.id) {
        await updatePatient(editPatient.id, formData);  
       toast.success("Patient Updated Successfully!");
      } else {
      await addPatient(formData);
        toast.success("Patient Added Successfully!");
      }
      
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save patient!");
    }
  };

  useEffect(() => {
    if(editPatient) {
      setFormData(editPatient);
    }
  },[editPatient]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-full max-w-[400px]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">
          {editPatient ? "Edit Patient" : "Add Patient"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="gender"
          placeholder="Gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={formData.phone || ""}
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