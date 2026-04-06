import { useEffect, useState } from "react";
import { getAppointments, addAppointment } from "../services/appointmentService";
import { getDoctors } from "../services/doctorService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateAppointmentStatus } from "../services/appointmentService";
import { toast } from "react-hot-toast/headless";
import { getSlots, bookSlot } from "../services/availabilityService";
import { motion, AnimatePresence } from "framer-motion";
import { IconCalendar, IconClock, IconUser, IconStethoscope, IconCheck, IconX, IconCalendarPlus, IconSearch } from "@tabler/icons-react";

function Appointments() {
  const location = useLocation();
  const selectedDoctor = location.state?.doctor;

  const { role } = useSelector((state) => state.auth);

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
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
      await bookSlot(selectedSlotId);
      toast.success("Appointment Booked Successfully! 🎉");

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

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <IconCalendar size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              📅 Appointment Management
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-1">
            Book and manage patient appointments
          </p>
        </motion.div>

        {/* Selected Doctor Banner */}
        <AnimatePresence>
          {selectedDoctor && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {selectedDoctor.name?.charAt(0)}
              </div>
              <div className="text-white">
                <p className="text-sm opacity-80">Selected Doctor</p>
                <p className="text-lg font-semibold">Dr. {selectedDoctor.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <IconCalendarPlus size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Book New Appointment</h2>
              <p className="text-gray-500 text-xs">Fill in the details to schedule an appointment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Patient Name */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Patient Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconUser size={18} />
                  </span>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </motion.div>

              {/* Doctor Select */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Doctor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconStethoscope size={18} />
                  </span>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Date */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Appointment Date</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconCalendar size={18} />
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white cursor-pointer"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Available Slots */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <IconClock size={18} className="text-gray-500" />
                <p className="text-sm font-semibold text-gray-700">Available Time Slots</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                {slots.length === 0 ? (
                  <p className="text-gray-400 text-sm bg-gray-50 px-4 py-3 rounded-lg">
                    {formData.doctorId && formData.date
                      ? "No slots available for selected date"
                      : "Select doctor and date to view available slots"}
                  </p>
                ) : (
                  slots.map((slot, index) => (
                    <motion.button
                      key={slot.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      disabled={slot.booked}
                      onClick={() => {
                        setSelectedSlotId(slot.id);
                        setFormData({
                          ...formData,
                          timeSlot: slot.timeSlot,
                        });
                      }}
                      whileHover={!slot.booked ? { scale: 1.05 } : {}}
                      whileTap={!slot.booked ? { scale: 0.95 } : {}}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        slot.booked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                          : selectedSlotId === slot.id
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg"
                      }`}
                    >
                      <IconClock size={16} />
                      {slot.timeSlot}
                      {selectedSlotId === slot.id && <IconCheck size={16} />}
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.span>
                    Booking...
                  </>
                ) : (
                  <>
                    <IconCalendarPlus size={20} />
                    Book Appointment
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Search & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch size={20} />
              </span>
              <input
                type="text"
                placeholder="Search appointments by patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-white"
              />
            </motion.div>
          </div>

          <div className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-100 px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <IconCalendar size={18} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                <p className="text-xs text-gray-500">Total Appointments</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Appointments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <IconCalendar size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Appointment Records</h2>
                <p className="text-gray-500 text-xs">
                  Showing {filteredAppointments.length} of {appointments.length} appointments
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <IconCalendar size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">No appointments found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((a) => (
                    <motion.tr
                      key={a.id}
                      variants={rowVariants}
                      className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                            {a.patientName?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                          <span className="font-medium text-gray-900">{a.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconStethoscope size={16} className="text-indigo-500" />
                          <span className="text-gray-700">Dr. {a.doctorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconCalendar size={16} className="text-gray-400" />
                          <span className="text-gray-600">{a.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border w-fit ${getStatusColor(
                              a.status
                            )}`}
                          >
                            {a.status === "APPROVED" && "✅ "}
                            {a.status === "REJECTED" && "❌ "}
                            {(!a.status || a.status === "PENDING") && "⏳ "}
                            {a.status || "PENDING"}
                          </span>

                          {role === "DOCTOR" && (
                            <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                disabled={loadingId === a.id}
                                onClick={() => handleStatusChange(a.id, "APPROVED")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                                  loadingId === a.id
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                <IconCheck size={14} />
                                {loadingId === a.id ? "..." : "Approve"}
                              </motion.button>

                              <motion.button
                                disabled={loadingId === a.id}
                                onClick={() => handleStatusChange(a.id, "REJECTED")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                                  loadingId === a.id
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                }`}
                              >
                                <IconX size={14} />
                                {loadingId === a.id ? "..." : "Reject"}
                              </motion.button>
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
    </div>
  );
}

export default Appointments;