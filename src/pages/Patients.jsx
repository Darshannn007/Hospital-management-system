/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {deletePatient, getPatients } from "../services/patientService";
import AddPatientForm from "../components/AddPatientForm"; // 👈 ADD THIS
import { toast } from "react-hot-toast";



function Patients() {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // 👈 ADD THIS

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch patients!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      toast.success("Patient deleted successfully!");
      fetchPatients(); 
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete patient!");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

 
  return (
    <div className="container mx-auto p-6">
  
      {/* 🔥 TOP SECTION (Heading + Button) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold">Patients</h1>
  
        <button
          onClick={() => setShowForm(true)}
          className="bg-linear-to-r from-[#1fad9f] to-[#67e1cf] text-white px-4 py-2 rounded-lg shadow"
        > 
          <span className="font-semibold">+</span> Add Patient
        </button>
      </div>
  
      {/* 🔥 TABLE */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
  
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left font-semibold">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left font-semibold">Age</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left font-semibold">Gender</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left font-semibold">Phone</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left font-semibold">Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  No patients found. Click '+ Add Patient' to add one.
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{p.name}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{p.age}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{p.gender}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{p.phone}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditPatient(p);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
      {/* 🔥 FORM POPUP */}
      {showForm && (<AddPatientForm editPatient={editPatient} onClose={() => {
      setShowForm(false);
      setEditPatient(null);   
      fetchPatients();
    }}
/>
)}
  
    </div>
  );
}

export default Patients;