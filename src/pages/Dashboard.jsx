import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Calendar, DollarSign, Plus, FileText, Activity, TrendingUp, Clock } from "lucide-react";
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

  const [isLoading, setIsLoading] = useState(true);

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

      const pending = appointments.filter((a) => a.status === "PENDING").length;
      const approved = appointments.filter((a) => a.status === "APPROVED").length;
      const rejected = appointments.filter((a) => a.status === "REJECTED").length;

      setStats({
        patients: patientsRes.data.length,
        doctors: doctorsRes.data.length,
        todayAppointments: appointments.filter((a) => a.date === today).length,
        revenue: appointments.length * 500,
        pending,
        approved,
        rejected,
      });
    } catch (err) {
      console.log(err);
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

  // 📊 Bar Chart with matching theme
  const barOptions = {
    chart: {
      id: "appointments-bar",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories: ["Pending", "Approved", "Rejected"],
      labels: { style: { colors: "#64748b" } },
    },
    yaxis: {
      labels: { style: { colors: "#64748b" } },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    colors: ["#3b82f6", "#22c55e", "#ef4444"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "50%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    theme: { mode: "light" },
  };

  const barSeries = [
    {
      name: "Appointments",
      data: [stats.pending, stats.approved, stats.rejected],
    },
  ];

  // 🥧 Pie Chart with matching theme
  const pieOptions = {
    labels: ["Pending", "Approved", "Rejected"],
    colors: ["#3b82f6", "#22c55e", "#ef4444"],
    legend: {
      position: "bottom",
      labels: { colors: "#64748b" },
    },
    stroke: { width: 0 },
    dataLabels: {
      style: { colors: ["#fff"] },
    },
    theme: { mode: "light" },
  };

  const pieSeries = [stats.pending, stats.approved, stats.rejected];

  const items = [
    {
      title: "Total Patients",
      icon: <Users size={24} />,
      value: stats.patients,
      gradient: "from-blue-500 to-indigo-600",
      bgGlow: "shadow-blue-500/20",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Appointments Today",
      icon: <Calendar size={24} />,
      value: stats.todayAppointments,
      gradient: "from-purple-500 to-pink-600",
      bgGlow: "shadow-purple-500/20",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Available Doctors",
      icon: <UserCheck size={24} />,
      value: stats.doctors,
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "shadow-emerald-500/20",
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Revenue (This Month)",
      icon: <DollarSign size={24} />,
      value: `₹${stats.revenue.toLocaleString()}`,
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "shadow-amber-500/20",
      trend: "+18%",
      trendUp: true,
    },
  ];

  const quickLinks = [
    { icon: <Plus size={18} />, text: "New Appointment", color: "from-blue-500 to-indigo-600" },
    { icon: <Users size={18} />, text: "Register Patient", color: "from-purple-500 to-pink-600" },
    { icon: <FileText size={18} />, text: "Generate Invoice", color: "from-emerald-500 to-teal-600" },
  ];

  const recentActivities = [
    { icon: "📅", text: "New appointment booked", time: "2 min ago", color: "bg-blue-100 text-blue-600" },
    { icon: "👨‍⚕️", text: "Dr. Smith updated schedule", time: "15 min ago", color: "bg-indigo-100 text-indigo-600" },
    { icon: "🧑‍🦱", text: "New patient registered", time: "1 hour ago", color: "bg-emerald-100 text-emerald-600" },
    { icon: "💊", text: "Prescription generated", time: "2 hours ago", color: "bg-amber-100 text-amber-600" },
  ];

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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Activity size={20} />
                </div>
                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  🏥 HMS Dashboard
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Welcome Back!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your hospital today.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-100 px-4 py-2 rounded-xl shadow-sm"
            >
              <Clock size={16} className="text-blue-600" />
              <span className="text-gray-600 text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10 ${item.bgGlow} overflow-hidden group`}
            >
              {/* Gradient Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    {item.title}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isLoading ? (
                      <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      item.value
                    )}
                  </h2>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">
                      {item.trend}
                    </span>
                    <span className="text-gray-400 text-xs">vs last month</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                >
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Bar Chart */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Appointment Status
                </h2>
                <p className="text-gray-500 text-sm">Overview by status type</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-xs text-blue-700">This Month</span>
              </div>
            </div>
            <Chart options={barOptions} series={barSeries} type="bar" height={280} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Status Distribution
                </h2>
                <p className="text-gray-500 text-sm">Percentage breakdown</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-700">Live Data</span>
              </div>
            </div>
            <Chart options={pieOptions} series={pieSeries} type="donut" height={280} />
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Quick Links */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Plus size={16} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                <p className="text-gray-500 text-xs">Common tasks</p>
              </div>
            </div>

            <div className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 p-4 rounded-xl transition-all duration-300 group"
                >
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${link.color} shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    {link.icon}
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-800 transition-colors">
                    {link.text}
                  </span>
                  <span className="ml-auto text-gray-400 group-hover:text-blue-600 transition-colors">
                    →
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-500/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Activity size={16} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <p className="text-gray-500 text-xs">Latest updates</p>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.color}`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;