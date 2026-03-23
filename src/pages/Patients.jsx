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
    <div>
  
      {/* 🔥 TOP SECTION (Heading + Button) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
  
        <button
          onClick={() => setShowForm(true)}
          className="bg-linear-to-r from-[#1fad9f] to-[#67e1cf] text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Patient
        </button>
      </div>
  
      {/* 🔥 TABLE */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 
      rounded-2xl shadow-lg overflow-hidden">
  
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  No patients found
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.age}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3 flex gap-3">

                  <button onClick={() => {
  setEditPatient(p);   // 👉 ye data bhej raha hai form ko
  setShowForm(true);   // 👉 form open
}}>
  Edit
</button>
  <span
    onClick={() => handleDelete(p.id)}
    className="text-red-500 cursor-pointer"
  >
    
  </span>

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