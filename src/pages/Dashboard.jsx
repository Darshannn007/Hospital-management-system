import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Calendar, DollarSign } from "lucide-react";
import Chart from "react-apexcharts";

import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getAppointments } from "../services/appointmentService";

function Dashboard() {

  const [stats, setStats] = useState({
    patients: 0,
    todayAppointments: 0,
    doctors: 0,
    revenue: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const patientsRes = await getPatients();
      const doctorsRes = await getDoctors();
      const appointmentsRes = await getAppointments();

      const appointments = appointmentsRes.data || [];

      const today = new Date().toISOString().split("T")[0];

      const pending = appointments.filter(a => a.status === "PENDING").length;
      const approved = appointments.filter(a => a.status === "APPROVED").length;
      const rejected = appointments.filter(a => a.status === "REJECTED").length;

      setStats({
        patients: patientsRes.data.length,
        doctors: doctorsRes.data.length,
        todayAppointments: appointments.filter(a => a.date === today).length,
        revenue: appointments.length * 500,
        pending,
        approved,
        rejected
      });

    } catch (err) {
      console.log(err);
    }
  };

  // 📊 Bar Chart
  const barOptions = {
    chart: { id: "appointments-bar" },
    xaxis: {
      categories: ["Pending", "Approved", "Rejected"],
    },
    theme: {
      mode: "dark"
    }
  };

  const barSeries = [
    {
      name: "Appointments",
      data: [stats.pending, stats.approved, stats.rejected],
    },
  ];

  // 🥧 Pie Chart
  const pieOptions = {
    labels: ["Pending", "Approved", "Rejected"],
    theme: {
      mode: "dark"
    }
  };

  const pieSeries = [stats.pending, stats.approved, stats.rejected];

  const items = [
    { title: "Total Patients", icon: <Users />, value: stats.patients },
    { title: "Appointments Today", icon: <Calendar />, value: stats.todayAppointments },
    { title: "Available Doctors", icon: <UserCheck />, value: stats.doctors },
    { title: "Revenue (This Month)", icon: <DollarSign />, value: `₹${stats.revenue}` },
  ];

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: "spring" }}
            className="bg-[#1e293b] p-5 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition"
          >
            <div>
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-1">
                {item.value}
              </h2>
            </div>

            <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔥 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Bar Chart */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Appointment Status
          </h2>

          <Chart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={300}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Status Distribution
          </h2>

          <Chart
            options={pieOptions}
            series={pieSeries}
            type="pie"
            height={300}
          />
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Quick Links */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Quick Links
          </h2>

          <div className="space-y-3">
            <button className="w-full bg-[#334155] p-3 rounded hover:bg-blue-500 transition">
              New Appointment
            </button>
            <button className="w-full bg-[#334155] p-3 rounded hover:bg-blue-500 transition">
              Register Patient
            </button>
            <button className="w-full bg-[#334155] p-3 rounded hover:bg-blue-500 transition">
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3 text-sm text-gray-300">
            <p>Latest appointment booked</p>
            <p>Doctor updated schedule</p>
            <p>New patient registered</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;