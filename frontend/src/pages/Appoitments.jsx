import { useEffect, useState } from "react";
import {
  getAppointments,
  addAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../services/appointmentService";
import { getDoctors } from "../services/doctorService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getSlots, bookSlot } from "../services/availabilityService";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconStethoscope,
  IconCheck,
  IconX,
  IconCalendarPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

function Appointments() {
  const location = useLocation();
  const selectedDoctor = location.state?.doctor;

  const { role } = useSelector((state) => state.auth);

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    date: "",
  });

  useEffect(() => {
    if (selectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorId: selectedDoctor.id,
      }));
    }
  }, [selectedDoctor]);

  const handleStatusChange = async (id, status) => {
    try {
      setLoadingId(id);
      await updateAppointmentStatus(id, status);
      fetchAppointments();
      toast.success(`Appointment ${status.toLowerCase()}!`);
    } catch (err) {
      toast.error("Error updating appointment");
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      setDeletingId(id);
      await deleteAppointment(id);
      fetchAppointments();
      toast.success("Appointment deleted successfully");
    } catch (err) {
      toast.error("Error deleting appointment");
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!formData.doctorId || !formData.date) return;

    const fetchSlots = async () => {
      try {
        const res = await getSlots(formData.doctorId, formData.date);
        setSlots(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSlots();
  }, [formData.doctorId, formData.date]);

  useEffect(() => {
    if (selectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorId: selectedDoctor.id,
      }));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    getDoctors()
      .then((res) => {
        setDoctors(res.data || []);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    getAppointments().then((res) => setAppointments(res.data || []));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlotId) {
      toast.error("Please select a slot");
      return;
    }

    setIsSubmitting(true);
    try {
      await addAppointment(formData);
      toast.success("Appointment Booked Successfully!!!🎉");
      await bookSlot(selectedSlotId);

      setFormData({
        patientName: "",
        doctorId: "",
        date: "",
      });

      setSelectedSlotId(null);
      setSlots([]);
      fetchAppointments();
    } catch (err) {
      console.log(err);
      toast.error("Error while booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-450 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-450 border-amber-500/20";
    }
  };

  return (
    <div className="p-5 md:p-8 space-y-6 text-slate-200">
      
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Bookings
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
            Appointments Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
            Book slots and manage patient appointments rosters dynamically.
          </p>
        </div>
      </motion.div>

      {/* Selected Doctor Banner */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-lg shadow-cyan-500/5"
          >
            <div className="w-12 h-12 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 font-bold text-xl">
              {selectedDoctor.name?.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Selected Specialist</p>
              <p className="text-base font-extrabold text-white">Dr. {selectedDoctor.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-3xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
            <IconCalendarPlus size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Book New Appointment</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Fill in the details to schedule an appointment slot</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-1.5">Patient Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450">
                  <IconUser size={18} />
                </span>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-xs outline-none"
                  required
                />
              </div>
            </div>

            {/* Doctor Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-1.5">Select Doctor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-455">
                  <IconStethoscope size={18} />
                </span>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
                  required
                >
                  <option value="" className="bg-slate-900 text-slate-400">Choose a doctor...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                      Dr. {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-460 uppercase tracking-widest block mb-1.5">Appointment Date</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-460">
                  <IconCalendar size={18} />
                </span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <IconClock size={16} className="text-cyan-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Time Slots</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {slots.length === 0 ? (
                <p className="text-slate-500 text-xs bg-white/2 px-4 py-3 rounded-xl border border-white/5 font-bold uppercase tracking-wider">
                  {formData.doctorId && formData.date
                    ? "No slots available for selected date"
                    : "Select doctor and date to view available slots"}
                </p>
              ) : (
                slots.map((slot, index) => (
                  <motion.button
                    key={slot.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    disabled={slot.booked}
                    onClick={() => {
                      setSelectedSlotId(slot.id);
                      setFormData({
                        ...formData,
                        timeSlot: slot.timeSlot,
                      });
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border uppercase tracking-wider ${
                      slot.booked
                        ? "bg-slate-900/50 text-slate-500 border-white/5 cursor-not-allowed line-through"
                        : selectedSlotId === slot.id
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]"
                        : "btn-teal-outline"
                    }`}
                  >
                    <IconClock size={14} />
                    {slot.timeSlot}
                    {selectedSlotId === slot.id && <IconCheck size={14} />}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-teal-outline px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="hms-spinner w-4 h-4 border-2"></div>
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <IconCalendarPlus size={18} />
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search appointments by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-xs outline-none"
            />
          </div>
        </div>

        <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-3.5 border border-white/10 shadow-sm">
          <div className="w-9 h-9 bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
            <IconCalendar size={18} />
          </div>
          <div>
            <span className="text-xl font-black text-white block leading-tight">{appointments.length}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Total Bookings</span>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-3xl border border-white/10 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Appointment Records</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              Showing {filteredAppointments.length} matching logs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white/2 border-b border-white/5 text-slate-400">
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Patient</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Doctor</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Date</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Status / Controls</th>
              </tr>
            </thead>

            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-white/5"
            >
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-white/2 rounded-full flex items-center justify-center border border-white/5">
                        <IconCalendar size={22} className="text-slate-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No appointments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((a) => (
                  <motion.tr
                    key={a.id}
                    variants={rowVariants}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 bg-cyan-950/10 flex items-center justify-center font-black text-xs shadow-sm">
                          {a.patientName?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <span className="font-bold text-xs text-slate-100">{a.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                        <IconStethoscope size={16} className="text-cyan-400" />
                        <span>Dr. {a.doctorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <IconCalendar size={16} className="text-slate-550" />
                        <span>{a.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider inline-flex items-center gap-1 ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status || "PENDING"}
                        </span>

                        {role === "DOCTOR" && (
                          <div className="flex gap-2">
                            <button
                              disabled={loadingId === a.id}
                              onClick={() => handleStatusChange(a.id, "APPROVED")}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20 transition-colors disabled:opacity-60"
                            >
                              Approve
                            </button>

                            <button
                              disabled={loadingId === a.id}
                              onClick={() => handleStatusChange(a.id, "REJECTED")}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 transition-colors disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {role === "ADMIN" && (
                          <div>
                            <button
                              disabled={deletingId === a.id}
                              onClick={() => handleDeleteAppointment(a.id)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-950/20 text-rose-450 hover:bg-rose-950/40 border border-rose-500/20 transition-colors disabled:opacity-60 flex items-center gap-1"
                            >
                              <IconTrash size={12} />
                              Delete
                            </button>
                          </div>
                        )}
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
  );
}

export default Appointments;