/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {deletePatient, getPatients } from "../services/patientService";
import AddPatientForm from "../components/AddPatientForm"; // 👈 ADD THIS


function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // 👈 ADD THIS

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      fetchPatients(); // 🔥 refresh
    } catch (err) {
      console.log(err);
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

  <span className="text-blue-500 cursor-pointer">
    Edit
  </span>

  <span
    onClick={() => handleDelete(p.id)}
    className="text-red-500 cursor-pointer"
  >
    Delete
  </span>

</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
      {/* 🔥 FORM POPUP */}
      {showForm && (<AddPatientForm onClose={() => { setShowForm(false); fetchPatients();}}/> // 🔥 data reload
)}
  
    </div>
  );
}

export default Patients;