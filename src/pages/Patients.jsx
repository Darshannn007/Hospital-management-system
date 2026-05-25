/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { deletePatient, getPatients } from "../services/patientService";
import AddPatientForm from "../components/AddPatientForm";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { IconUsers, IconUserPlus, IconEdit, IconTrash, IconSearch, IconUser } from "@tabler/icons-react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-4 md:p-6 w-full box-border">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                  <IconUsers size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  🏥 Patient Management
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Patients
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Manage and view all registered patients
              </p>
            </div>

            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 md:px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
            >
              <IconUserPlus size={20} />
              Add Patient
            </motion.button>
          </div>
        </motion.div>

        {/* Search & Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch size={20} />
              </span>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-white text-sm md:text-base"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 shrink-0">
            <div className="bg-white border border-gray-100 px-4 md:px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <IconUsers size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-xs text-gray-500">Total Patients</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden w-full"
        >
          {/* Table Header Info */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <IconUser size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Patient Records</h2>
                <p className="text-gray-500 text-xs">
                  Showing {filteredPatients.length} of {patients.length} patients
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block text-3xl"
                      >
                        ⏳
                      </motion.div>
                      <p className="text-gray-500 mt-2">Loading patients...</p>
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <IconUsers size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">No patients found</p>
                        <motion.button
                          onClick={() => setShowForm(true)}
                          whileHover={{ scale: 1.05 }}
                          className="text-blue-600 font-medium hover:text-indigo-600"
                        >
                          + Add your first patient
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p, index) => (
                    <motion.tr
                      key={p.id}
                      variants={rowVariants}
                      className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md text-sm md:text-base">
                            {p.name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <span className="font-medium text-gray-900 text-sm md:text-base">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          {p.age} yrs
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                          p.gender === "Male" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-pink-100 text-pink-700"
                        }`}>
                          {p.gender === "Male" ? "👨" : "👩"} {p.gender}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="text-gray-600 text-sm">📞 {p.phone}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => {
                              setEditPatient(p);
                              setShowForm(true);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <IconEdit size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(p.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 md:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <IconTrash size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Form Popup */}
      <AnimatePresence>
        {showForm && (
          <AddPatientForm
            editPatient={editPatient}
            onClose={() => {
              setShowForm(false);
              setEditPatient(null);
              fetchPatients();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Patients;