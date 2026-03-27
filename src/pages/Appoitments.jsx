import { useEffect, useState } from "react";
import { getAppointments, addAppointment } from "../services/appointmentService";
import { getDoctors } from "../services/doctorService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateAppointmentStatus } from "../services/appointmentService";
import {toast} from "react-hot-toast/headless";




function Appointments() {
  const location = useLocation();
  const selectedDoctor = location.state?.doctor;

  const { role } = useSelector((state) => state.auth);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    date: "",
  });

 const handleStatusChange = async (id, status) => {
  try{
    setLoadingId(id);
    await updateAppointmentStatus(id,status);
    fetchAppointments();
  }catch(err){
    toast.error("Error Occured During Appointment Updation")
    console.log(err);
  }finally{
    setLoadingId(null);
  }
 };

  // 🔥 load data
  useEffect(() => {
    fetchAppointments();
    getDoctors().then((res) => setDoctors(res.data || []));
  }, []);

  // 🔥 doctor auto-select FIX
  useEffect(() => {
    if (selectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorId: selectedDoctor.id,
      }));
    }
  }, [selectedDoctor]);

  const fetchAppointments = () => {
    getAppointments().then((res) => setAppointments(res.data || []));
  };

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addAppointment(formData);
      toast.success("Appointment Sent for aprovalll");
      // reset form
      setFormData({
        patientName: "",
        doctorId: "",
        date: "",
      });

      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Appointments</h2>

      {/* 🔥 FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3"
      >
        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={formData.patientName}
          onChange={handleChange}
          className="border p-2 rounded w-full md:w-1/4" required/>

        {/* Doctor select */}
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="border p-2 rounded w-full md:w-1/4" required>

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
          className="border p-2 rounded w-full md:w-1/4"
          required/>

        <button className="bg-teal-600 text-white px-4 py-2 rounded">
          Book
        </button>
      </form>

      {/* 🔥 TABLE */}
      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
  {appointments.map((a) => (
    <tr key={a.id} className="border-b">
      <td>{a.patientName}</td>
      <td>{a.doctorName}</td>
      <td>{a.date}</td>

      <td>
        <div className="flex flex-col gap-2">

          {/* STATUS */}
          <span
            className={`px-2 py-1 text-sm rounded w-fit ${
              a.status === "APPROVED"
                ? "bg-green-200 text-green-800"
                : a.status === "REJECTED"
                ? "bg-red-200 text-red-800"
                : "bg-yellow-200 text-yellow-800"
            }`}
          >
            {a.status || "PENDING"}
          </span>

          {/* 👨‍⚕️ DOCTOR BUTTONS */}
          {role === "DOCTOR" && (
            <div className="flex gap-2">
              <button
                disabled={loadingId === a.id}
                onClick={() => handleStatusChange(a.id, "APPROVED")}
                className={`px-2 py-1 text-xs rounded text-white ${
                  loadingId === a.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500"
                }`}
              >
                {loadingId === a.id ? "..." : "Approve"}
              </button>

              <button
                disabled={loadingId === a.id}
                onClick={() => handleStatusChange(a.id, "REJECTED")}
                className={`px-2 py-1 text-xs rounded text-white ${
                  loadingId === a.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500"
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