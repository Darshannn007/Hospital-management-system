import { useEffect, useState } from "react";
import { deletePatient, getPatients } from "../services/patientService";
import AddPatientForm from "../components/AddPatientForm";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { IconUsers, IconUserPlus, IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch patients registry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient record?")) return;
    try {
      await deletePatient(id);
      toast.success("Patient record deleted successfully! ✅");
      fetchPatients();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete patient record");
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
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="p-5 md:p-8 space-y-6 text-slate-200">
      
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
            Patients Directory
          </h1>
          <p className="text-xs text-slate-300 mt-1.5 font-medium tracking-wide">
            Register new patient charts, modify profile records, and audit directories.
          </p>
        </div>

        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-teal-outline px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <IconUserPlus size={16} />
          Add Patient
        </motion.button>
      </motion.div>

      {/* Search & Metrics Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
            />
          </div>
        </div>

        {/* Counter Widget */}
        <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-3.5 border border-white/10">
          <div className="w-9 h-9 bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
            <IconUsers size={18} />
          </div>
          <div>
            <span className="text-xl font-black text-white block leading-tight">{patients.length}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">Patients Total</span>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl overflow-hidden border border-white/10"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Patient Records</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              List of {filteredPatients.length} registered profiles
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-white/2 border-b border-white/5 text-slate-300">
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Patient Name</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Age Bracket</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Gender Status</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Contact Phone</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-white/5"
            >
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="hms-spinner mx-auto mb-3"></div>
                    <p className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Accessing Database...</p>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">📁</span>
                      <p className="font-bold uppercase tracking-widest text-[9px]">No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <motion.tr
                    key={p.id}
                    variants={rowVariants}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 flex items-center justify-center font-black text-xs">
                          {p.name?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <span className="font-bold text-xs text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 text-slate-200 border border-white/5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {p.age} Yrs
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${
                        p.gender === "Male" 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                          : "bg-pink-500/10 text-pink-400 border-pink-500/20"
                      }`}>
                        <span>{p.gender === "Male" ? "👨" : "👩"}</span>
                        <span>{p.gender}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 font-semibold">
                      {p.phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditPatient(p);
                            setShowForm(true);
                          }}
                          className="p-1.5 bg-cyan-950/20 hover:bg-cyan-950/45 border border-cyan-500/20 text-cyan-400 rounded-lg transition-colors"
                          title="Edit Patient"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 bg-rose-950/20 hover:bg-rose-950/45 border border-rose-500/20 text-rose-400 rounded-lg transition-colors"
                          title="Delete Patient"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit/Add Form Popup Modal */}
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