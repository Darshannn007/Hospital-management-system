import { useEffect, useState } from "react";
import {
  getDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
} from "../services/doctorService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Doctor() {
  const { role } = useSelector((state) => state.auth);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    education: "",
  });

  const [editId, setEditId] = useState(null);

 
  const navigate = useNavigate();

  // 🔥 FETCH
  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔥 INPUT HANDLE
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value,});};

  // 🔥 ADD / UPDATE
  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateDoctor(editId, formData);
        setEditId(null);
      } else {
        await addDoctor(formData);
   
      }

      setFormData({
        name: "",
        specialization: "",
        experience: "",
        education: "",
      });

      fetchDoctors();
      console.log("CURRENT ROLE:", role);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await deleteDoctor(id);
    fetchDoctors();
    toast.success("Deleted🎗️")
  };

  // 🔥 EDIT
  const handleEdit = (doc) => {
    setFormData({
      name: doc.name || "",
      specialization: doc.specialization || "",
      experience: doc.experience || "",
      education: doc.education || "",
    });
    setEditId(doc.id);
  };

  // 🔥 BOOK APPOINTMENT
  const handleBook = (doctor) => {
    navigate("/appointments", {
      state: { doctor },
    });
  };

  return (
    <div className="">
      {/* 🔥 FORM (ADMIN ONLY) */}
      {role === "ADMIN" && (
        <>
          <div className="grid bg-blue-200 grid-cols-1 md:grid-cols-4 gap-4 mb-4 px-10 py-5 rounded-xl">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="bg-blue-100 border p-2 rounded"
            />
            <input name="specialization" value={formData.specialization} onChange={handleChange}
              placeholder="Specialization"
              className="border p-2 rounded bg-blue-100"
            />
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Experience"
              className="border p-2 rounded bg-blue-100"
            />
            <input
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Education"
              className="border p-2 rounded bg-blue-100"
            />
          </div>

          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            {editId ? "Update Doctor" : "Add Doctor"}
          </button>
        </>
      )}

      {/* 🔥 DOCTOR CARDS */}
      <div className="grid grid-cols-1 m-20 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {Array.isArray(doctors) && doctors.map((doc) => (
            <div key={doc.id} className=" flex flex-col gap-5 bg-linear-to-br mb-20 w-80 h-80 from-blue-200 to-indigo-400 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border">
        {/* Avatar */}
       <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
          {doc.name?.charAt(0)}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Dr. {doc.name}
          </h3>
          <p className="text-sm text-gray-500">
            {doc.specialization}
          </p>
        </div>
       </div>

  {/* Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p className="text-xl font-bold font-sans">🎓 {doc.education}</p>
            <p className="text-xl font-bold font-sans mb-7">💼 {doc.experience}</p>
          </div>

  {/* Actions */}
      <div className="flex items-center justify-center mt-5">

    {/* ADMIN */}
    {role === "ADMIN" && (
      <div className="flex gap-3">
        <button
          onClick={() => handleEdit(doc)}
          className="text-blue-600 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(doc.id)}
          className="text-red-500 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    )}

    {/* PATIENT */}
    {(role === "PATIENT" || role === "USER" || role === "ADMIN" || role === "DOCTOR") && (
      <button onClick={() => handleBook(doc)} className="bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm">
        Book Appointment
      </button>
    )}
  </div>
</div>
          ))}
      </div>
    </div>
  );
}

export default Doctor;