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
import { motion, AnimatePresence } from "framer-motion";
import { IconStethoscope, IconUserPlus, IconEdit, IconTrash, IconCalendarPlus, IconSearch, IconBriefcase, IconSchool } from "@tabler/icons-react";

function Doctor() {
  const { role } = useSelector((state) => state.auth);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    education: "",
  });

  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateDoctor(editId, formData);
        toast.success("Doctor updated successfully! ✅");
        setEditId(null);
      } else {
        await addDoctor(formData);
        toast.success("Doctor added successfully! ✅");
      }

      setFormData({
        name: "",
        specialization: "",
        experience: "",
        education: "",
      });
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    await deleteDoctor(id);
    fetchDoctors();
    toast.success("Doctor deleted! 🗑️");
  };

  const handleEdit = (doc) => {
    setFormData({
      name: doc.name || "",
      specialization: doc.specialization || "",
      experience: doc.experience || "",
      education: doc.education || "",
    });
    setEditId(doc.id);
    setShowForm(true);
  };

  const handleBook = (doctor) => {
    navigate("/appointments", {
      state: { doctor },
    });
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-6 overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <IconStethoscope size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  👨‍⚕️ Doctor Directory
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Our Doctors
              </h1>
              <p className="text-gray-600 mt-1">
                Find and book appointments with our expert doctors
              </p>
            </div>

            {role === "ADMIN" && (
              <motion.button
                onClick={() => {
                  setShowForm(true);
                  setEditId(null);
                  setFormData({ name: "", specialization: "", experience: "", education: "" });
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <IconUserPlus size={20} />
                Add Doctor
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Search & Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1">
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch size={20} />
              </span>
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-white"
              />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-100 px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <IconStethoscope size={18} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
                <p className="text-xs text-gray-500">Total Doctors</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Doctor Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-5xl"
            >
              ⏳
            </motion.div>
            <p className="text-gray-500 mt-4">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IconStethoscope size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No doctors found</p>
            {role === "ADMIN" && (
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                className="mt-4 text-blue-600 font-medium hover:text-indigo-600"
              >
                + Add your first doctor
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDoctors.map((doc) => (
              <motion.div
                key={doc.id}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)" }}
                className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden group"
              >
                {/* Card Header with Gradient */}
                <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      animate={{ x: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                    />
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center -mt-12 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-2xl text-3xl font-bold shadow-xl shadow-blue-500/30 border-4 border-white"
                  >
                    {doc.name?.charAt(0)?.toUpperCase()}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Dr. {doc.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {doc.specialization}
                  </p>

                  {/* Info Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
                      <IconSchool size={16} />
                      {doc.education}
                    </span>
                    <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm">
                      <IconBriefcase size={16} />
                      {doc.experience}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {/* Book Button - All Roles */}
                    <motion.button
                      onClick={() => handleBook(doc)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                    >
                      <IconCalendarPlus size={20} />
                      Book Appointment
                    </motion.button>

                    {/* Admin Actions */}
                    {role === "ADMIN" && (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(doc)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                        >
                          <IconEdit size={18} />
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(doc.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                        >
                          <IconTrash size={18} />
                          Delete
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <IconStethoscope size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editId ? "Edit Doctor" : "Add New Doctor"}
                  </h2>
                  <p className="text-sm text-gray-500">Fill in the doctor details</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Specialization</label>
                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Cardiologist"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Experience</label>
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="10+ years"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Education</label>
                  <input
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="MBBS, MD"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => setShowForm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30"
                >
                  {editId ? "Update Doctor" : "Add Doctor"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Doctor;