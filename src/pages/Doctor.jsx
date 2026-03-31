import { useEffect, useState } from "react";
import {
  getDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
} from "../services/doctorService";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Doctor() {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    education: "",
  });

  const [editId, setEditId] = useState(null);

  const { role } = useSelector((state) => state.auth);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await deleteDoctor(id);
    fetchDoctors();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.isArray(doctors) &&
          doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-5 bg-white shadow-lg rounded-xl border hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold text-gray-800">
                Doctor: {doc.name}
              </h3>

              <p className="text-xl text-gray-600 mt-1">
                Specialization: {doc.specialization}
              </p>

              <p className="text-xl text-gray-500">
                Experience: {doc.experience}
              </p>

              <p className="text-xl text-gray-500 mb-3">
                Education: {doc.education}
              </p>

              <div className="flex justify-between items-center mt-3">
                {/* 👑 ADMIN CONTROLS */}
                {role === "ADMIN" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* 👤 USER BOOK BUTTON */}
                {role === "USER" && (
                  <button
                    onClick={() => handleBook(doc)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
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