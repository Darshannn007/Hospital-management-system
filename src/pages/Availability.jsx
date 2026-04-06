import { useEffect, useState } from "react";
import { getDoctors } from "../services/doctorService";
import { createSlot } from "../services/availabilityService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { IconCalendarPlus, IconClock, IconUserCheck, IconCalendar } from "@tabler/icons-react";

function AdminAvailability() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
  });

  const [timeSlots, setTimeSlots] = useState([
    "10:00-11:00",
    "11:00-12:00",
    "12:00-01:00",
    "02:00-03:00",
    "03:00-04:00",
  ]);

  useEffect(() => {
    getDoctors().then((res) => setDoctors(res.data || []));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSlots = async () => {
    if (!formData.doctorId || !formData.date) {
      toast.error("Select doctor & date");
      return;
    }

    setIsLoading(true);
    try {
      for (let slot of timeSlots) {
        await createSlot({
          doctorId: formData.doctorId,
          date: formData.date,
          timeSlot: slot,
          booked: false,
        });
      }

      toast.success("Slots Created Successfully 🔥");
    } catch (err) {
      console.log(err);
      toast.error("Error creating slots");
    } finally {
      setIsLoading(false);
    }
  };

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <IconCalendarPlus size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              📅 Admin Panel
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
            Doctor Availability
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage appointment slots for doctors
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <IconUserCheck size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Create Slots</h2>
                <p className="text-gray-500 text-xs">Select doctor and date to create availability</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Doctor Select */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex-1"
              >
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select Doctor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    👨‍⚕️
                  </span>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Date Input */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex-1"
              >
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select Date
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    📅
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white cursor-pointer"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div className="flex items-end">
                <motion.button
                  onClick={handleCreateSlots}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <IconCalendarPlus size={20} />
                      Create Slots
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Slot Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <IconClock size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Default Time Slots</h2>
              <p className="text-gray-500 text-xs">These slots will be created for the selected date</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {timeSlots.map((slot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="relative group"
              >
                <div className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2">
                  <IconClock size={16} />
                  {slot}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3"
          >
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Pro Tip</p>
              <p className="text-xs text-blue-600">
                Each slot represents a 1-hour appointment window. Patients can book any available slot.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminAvailability;