import { useEffect, useState } from "react";
import { getDoctors } from "../services/doctorService";
import { createSlot } from "../services/availabilityService";
import { toast } from "react-hot-toast";

function AdminAvailability() {
  const [doctors, setDoctors] = useState([]);

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
    }
  };

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">

      <h2 className="text-2xl font-bold mb-6">
        Doctor Availability (Admin)
      </h2>

      {/* FORM */}
      <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-4">

        {/* Doctor */}
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="p-3 rounded bg-[#0f172a] border border-gray-600"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-3 rounded bg-[#0f172a] cursor-pointer border border-gray-600" />

        {/* Button */}
        <button
          onClick={handleCreateSlots}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg"
        >
          Create Slots
        </button>

      </div>

      {/* SLOT PREVIEW */}
      <div className="mt-6 bg-[#1e293b] p-6 rounded-xl">
        <h3 className="mb-4">Default Slots</h3>

        <div className="flex gap-3 flex-wrap">
          {timeSlots.map((slot, i) => (
            <span
              key={i}
              className="px-3 py-2 bg-blue-500 rounded"
            >
              {slot}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AdminAvailability;