import { useEffect, useState } from "react";
import { getDoctors } from "../services/doctorService";
import { createSlot } from "../services/availabilityService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { IconCalendarPlus, IconClock, IconUserCheck } from "@tabler/icons-react";

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
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
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
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Schedule
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
            Doctor Availability
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
            Configure calendar appointment slots for doctors registry availability.
          </p>
        </div>
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
          className="glass-card p-6 rounded-3xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
              <IconUserCheck size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Create Slots</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Select doctor and date to generate availability</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Doctor Select */}
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-1.5">
                Select Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
              >
                <option value="" className="bg-slate-900 text-slate-400">Choose a doctor...</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
              />
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-auto">
              <button
                onClick={handleCreateSlots}
                disabled={isLoading}
                className="w-full btn-teal-outline px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="hms-spinner w-4 h-4 border-2"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <IconCalendarPlus size={18} />
                    <span>Create Slots</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Slot Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-3xl border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
            <IconClock size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Default Time Slots</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">These slots will be created for the selected date</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {timeSlots.map((slot, i) => (
            <div
              key={i}
              className="px-5 py-3 bg-white/2 border border-white/10 text-cyan-300 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <IconClock size={14} className="text-cyan-400" />
              {slot}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-white/2 border border-white/5 rounded-xl flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Pro Tip</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Each slot represents a 1-hour appointment window. Patients can book any available slot directly from bookings.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminAvailability;