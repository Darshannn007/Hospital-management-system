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
    if (!formData.name.trim() || !formData.specialization.trim()) {
      toast.error("Name and Specialization are required");
      return;
    }

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
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      fetchDoctors();
      toast.success("Doctor deleted! 🗑️");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete doctor");
    }
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
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="p-5 md:p-8 space-y-6 text-slate-200">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Directory
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
              Doctors Registry
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
              Find and schedule appointments with our network medical specialists.
            </p>
          </div>

          {role === "ADMIN" && (
            <button
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setFormData({ name: "", specialization: "", experience: "", education: "" });
              }}
              className="btn-teal-outline px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 uppercase tracking-wider"
            >
              <IconUserPlus size={18} />
              Add Doctor
            </button>
          )}
        </div>
      </motion.div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-xs outline-none"
            />
          </div>
        </div>

        {/* Stats counter widget */}
        <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-3.5 border border-white/10 shadow-sm">
          <div className="w-9 h-9 bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
            <IconStethoscope size={18} />
          </div>
          <div>
            <span className="text-xl font-black text-white block leading-tight">{doctors.length}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Total Doctors</span>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="hms-spinner mb-3"></div>
          <p className="font-bold uppercase tracking-widest text-[9px] text-slate-500">Accessing Directory...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-white/2 rounded-full flex items-center justify-center mb-4 border border-white/5">
            <IconStethoscope size={30} className="text-slate-500" />
          </div>
          <p className="text-xs text-slate-505 font-bold uppercase tracking-wider">No doctors found</p>
          {role === "ADMIN" && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-cyan-400 font-bold hover:text-cyan-300 text-xs uppercase tracking-wider"
            >
              + Add Doctor Record
            </button>
          )}
        </div>
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
              className="glass-card border border-white/10 rounded-3xl overflow-hidden group flex flex-col"
            >
              {/* Minimal Card Header with thin outline border */}
              <div className="h-16 bg-white/2 border-b border-white/5 relative overflow-hidden" />

              {/* Avatar Icon */}
              <div className="flex justify-center -mt-10 relative z-10">
                <div className="w-20 h-20 bg-slate-900 border-4 border-slate-950 rounded-2xl flex items-center justify-center text-cyan-400 font-black text-2xl shadow-xl border border-cyan-500/20 bg-cyan-950/10">
                  {doc.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-6 pt-4 text-center flex-1 flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                  <h3 className="text-lg font-black text-white">
                    Dr. {doc.name}
                  </h3>
                  <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">
                    {doc.specialization}
                  </p>
                </div>

                {/* Attributes Details Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 bg-white/2 border border-white/5 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <IconSchool size={14} className="text-cyan-400" />
                    {doc.education || "MD"}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/2 border border-white/5 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <IconBriefcase size={14} className="text-cyan-400" />
                    {doc.experience || "5+ Yrs"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleBook(doc)}
                    className="w-full btn-teal-outline py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <IconCalendarPlus size={18} />
                    Book Appointment
                  </button>

                  {role === "ADMIN" && (
                    <div className="flex gap-2 pt-1.5">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-cyan-950/20 text-cyan-400 rounded-xl font-bold text-xs uppercase hover:bg-cyan-950/40 border border-cyan-500/20 transition-colors"
                      >
                        <IconEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-rose-950/20 text-rose-455 rounded-xl font-bold text-xs uppercase hover:bg-rose-950/40 border border-rose-500/20 transition-colors"
                      >
                        <IconTrash size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-3xl w-full max-w-sm p-6 border border-white/10 text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border border-cyan-500/20 rounded-xl flex items-center justify-center bg-cyan-950/10">
                  <IconStethoscope size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    {editId ? "Edit Doctor" : "Add New Doctor"}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Fill in the specialist details</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Specialization</label>
                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Cardiologist"
                    className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Experience</label>
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="10+ years"
                    className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Education</label>
                  <input
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="MBBS, MD"
                    className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-white/2 text-slate-400 rounded-xl font-bold text-xs uppercase hover:bg-white/5 border border-transparent transition-colors tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 btn-teal-outline py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  {editId ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Doctor;