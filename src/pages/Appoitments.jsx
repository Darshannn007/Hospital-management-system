import { useEffect, useState } from "react";
import { getAppointments, addAppointment } from "../services/appointmentService";
import { getDoctors } from "../services/doctorService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateAppointmentStatus } from "../services/appointmentService";
import { toast } from "react-hot-toast/headless";
import { getSlots, bookSlot } from "../services/availabilityService";

function Appointments() {
  const location = useLocation();
  const selectedDoctor = location.state?.doctor;

  const { role } = useSelector((state) => state.auth);

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    date: "",
  });

  const handleStatusChange = async (id, status) => {
    try {
      setLoadingId(id);
      await updateAppointmentStatus(id, status);
      fetchAppointments();
    } catch (err) {
      toast.error("Error Occured During Appointment Updation");
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  };

 // 🔥 ADD THIS useEffect (slots fetch)
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
        console.log("DOCTORS:", res.data); // 🔥 debug
        setDoctors(res.data || []);
      })
      .catch((err) => console.log(err));
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
  
    try {
      // 🔥 1. Appointment create
      await addAppointment(formData);
  
      // 🔥 2. Slot book
      await bookSlot(selectedSlotId);
  
      toast.success("Appointment Booked Successfully");
  
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
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Appointments
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center"
      >
        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={formData.patientName}
          onChange={handleChange}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5 rounded-lg w-full md:w-1/4"
          required
        />

        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5 rounded-lg w-full md:w-1/4"
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2.5 rounded-lg w-full md:w-1/4"
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
          Book
        </button>
      </form>
      {/* 🔥 SLOT SELECTION */}
<div className="mb-6">
  <p className="text-sm text-gray-600 mb-2">Available Slots</p>

  <div className="flex gap-3 flex-wrap">
    {slots.length === 0 && (
      <p className="text-gray-400 text-sm">No slots available</p>
    )}

    {slots.map((slot) => (
      <button
        key={slot.id}
        disabled={slot.booked}
        onClick={() => {
          setSelectedSlotId(slot.id);
          setFormData({
            ...formData,
            timeSlot: slot.timeSlot,
          });
        }}
        className={`px-3 py-2 rounded text-sm ${
          slot.booked
            ? "bg-gray-300 cursor-not-allowed"
            : selectedSlotId === slot.id
            ? "bg-green-500 text-white"
            : "bg-blue-500 text-white"
        }`}
      >
        {slot.timeSlot}
      </button>
    ))}
  </div>
</div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium text-gray-800">
                  {a.patientName}
                </td>

                <td className="p-3 text-gray-600">
                  {a.doctorName}
                </td>

                <td className="p-3 text-gray-600">
                  {a.date}
                </td>

                <td className="p-3">
                  <div className="flex flex-col gap-2">

                    {/* STATUS */}
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full w-fit ${
                        a.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : a.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.status || "PENDING"}
                    </span>

                    {/* DOCTOR ACTIONS */}
                    {role === "DOCTOR" && (
                      <div className="flex gap-2">
                        <button
                          disabled={loadingId === a.id}
                          onClick={() =>
                            handleStatusChange(a.id, "APPROVED")
                          }
                          className={`px-3 py-1 text-xs rounded-md text-white transition ${
                            loadingId === a.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {loadingId === a.id ? "..." : "Approve"}
                        </button>

                        <button
                          disabled={loadingId === a.id}
                          onClick={() =>
                            handleStatusChange(a.id, "REJECTED")
                          }
                          className={`px-3 py-1 text-xs rounded-md text-white transition ${
                            loadingId === a.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {loadingId === a.id ? "..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;