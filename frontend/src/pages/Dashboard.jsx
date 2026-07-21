import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Plus,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  Building2,
  MapPin,
  Star,
  Stethoscope,
} from "lucide-react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getAppointments } from "../services/appointmentService";
import toast from "react-hot-toast";
import CountUp from "../components/CountUp";
import TiltCard from "../components/TiltCard";

const hospitalInfo = {
  name: "CityCare Multispeciality Hospital",
  about:
    "Trusted care network delivering emergency, surgical and speciality services across city locations.",
  established: "2009",
  accreditation: "NABH & ISO 9001",
  emergency: "24/7",
  helpline: "+91 90000 00000",
};

const branchTemplates = [
  {
    id: 1,
    name: "Central City Branch",
    location: "MG Road, Downtown",
    beds: 140,
    baseDoctors: 12,
    baseSpecialists: 7,
    baseNurses: 28,
    baseDiseasesCured: 460,
    topDiseases: ["Diabetes", "Hypertension", "Asthma"],
  },
  {
    id: 2,
    name: "North Care Branch",
    location: "Airport Road",
    beds: 110,
    baseDoctors: 9,
    baseSpecialists: 5,
    baseNurses: 22,
    baseDiseasesCured: 370,
    topDiseases: ["Cardiac Care", "Thyroid", "Migraines"],
  },
  {
    id: 3,
    name: "South Wellness Branch",
    location: "Lake View Nagar",
    beds: 90,
    baseDoctors: 8,
    baseSpecialists: 4,
    baseNurses: 18,
    baseDiseasesCured: 315,
    topDiseases: ["Skin Allergy", "Orthopedic Pain", "Gastritis"],
  },
];

const patientReviews = [
  {
    id: 1,
    name: "Aarti Kulkarni",
    comment: "Doctors explained treatment clearly and recovery was fast.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rohan Mehta",
    comment: "Clean branch, polite staff and quick appointment process.",
    rating: 5,
  },
  {
    id: 3,
    name: "Neha Sharma",
    comment: "Specialist team handled my mother's case very well.",
    rating: 4,
  },
];

function Dashboard() {
  const { role } = useSelector((state) => state.auth);
  const isPatient = role === "PATIENT";
  const navigate = useNavigate();

  const [themeMode, setThemeMode] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [stats, setStats] = useState({
    patients: 0,
    todayAppointments: 0,
    doctors: 0,
    revenue: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [patientStats, setPatientStats] = useState({
    totalBranches: branchTemplates.length,
    totalDoctors: 0,
    totalSpecialists: 0,
    totalNurses: 0,
    totalDiseasesCured: 0,
    averageRating: 4.8,
  });
  const [branchDetails, setBranchDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPatient) {
      fetchPatientData();
      return;
    }
    fetchAdminDoctorData();
  }, [isPatient]);

  const fetchAdminDoctorData = async () => {
    setIsLoading(true);
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
      toast.error("Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientData = async () => {
    setIsLoading(true);
    try {
      const doctorsRes = await getDoctors();
      const doctors = doctorsRes.data || [];
      const branchCount = branchTemplates.length;

      const computedBranches = branchTemplates.map((branch, index) => {
        const assignedDoctors = doctors.filter(
          (_, doctorIndex) => doctorIndex % branchCount === index
        );

        const specializationSet = new Set(
          assignedDoctors
            .map((doc) => doc.specialization)
            .filter(Boolean)
            .map((specialization) => specialization.trim().toLowerCase())
        );

        const doctorCount = assignedDoctors.length || branch.baseDoctors;
        const specialistCount =
          specializationSet.size || branch.baseSpecialists;
        const nurseCount = Math.max(branch.baseNurses, doctorCount * 2);
        const diseasesCured = branch.baseDiseasesCured + doctorCount * 8;

        return {
          ...branch,
          doctorCount,
          specialistCount,
          nurseCount,
          diseasesCured,
        };
      });

      const allSpecializations = new Set(
        doctors
          .map((doc) => doc.specialization)
          .filter(Boolean)
          .map((specialization) => specialization.trim().toLowerCase())
      );

      const totalDoctors = doctors.length;
      const totalNurses = computedBranches.reduce(
        (sum, branch) => sum + branch.nurseCount,
        0
      );
      const totalDiseasesCured = computedBranches.reduce(
        (sum, branch) => sum + branch.diseasesCured,
        0
      );

      setBranchDetails(computedBranches);
      setPatientStats({
        totalBranches: branchCount,
        totalDoctors,
        totalSpecialists: allSpecializations.size || 12,
        totalNurses,
        totalDiseasesCured,
        averageRating: 4.8,
      });
    } catch (err) {
      console.log(err);

      const fallbackBranches = branchTemplates.map((branch) => ({
        ...branch,
        doctorCount: branch.baseDoctors,
        specialistCount: branch.baseSpecialists,
        nurseCount: branch.baseNurses,
        diseasesCured: branch.baseDiseasesCured,
      }));

      setBranchDetails(fallbackBranches);
      setPatientStats({
        totalBranches: fallbackBranches.length,
        totalDoctors: fallbackBranches.reduce(
          (sum, branch) => sum + branch.doctorCount,
          0
        ),
        totalSpecialists: fallbackBranches.reduce(
          (sum, branch) => sum + branch.specialistCount,
          0
        ),
        totalNurses: fallbackBranches.reduce(
          (sum, branch) => sum + branch.nurseCount,
          0
        ),
        totalDiseasesCured: fallbackBranches.reduce(
          (sum, branch) => sum + branch.diseasesCured,
          0
        ),
        averageRating: 4.8,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animations configuration
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
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // Apex Charts Options adjusted for dark theme matching the reference
  const chartColors = themeMode === "dark" 
    ? ["#06b6d4", "#10b981", "#f43f5e"] 
    : ["#0d9488", "#059669", "#e11d48"];

  const barOptions = {
    chart: {
      id: "appointments-bar",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories: ["Pending", "Approved", "Rejected"],
      labels: { style: { colors: themeMode === "dark" ? "#94a3b8" : "#64748b", fontFamily: "Outfit", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: themeMode === "dark" ? "#94a3b8" : "#64748b", fontFamily: "Outfit" } },
    },
    grid: {
      borderColor: themeMode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      strokeDashArray: 4,
    },
    colors: chartColors,
    fill: {
      type: "gradient",
      gradient: {
        shade: themeMode === "dark" ? "dark" : "light",
        type: "vertical",
        shadeIntensity: 0.35,
        gradientToColors: themeMode === "dark" 
          ? ["#0891b2", "#047857", "#be123c"]
          : ["#0284c7", "#059669", "#f43f5e"],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        stops: [0, 100]
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "40%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    theme: { mode: themeMode },
  };

  const barSeries = [
    {
      name: "Appointments",
      data: [stats.pending, stats.approved, stats.rejected],
    },
  ];

  const pieOptions = {
    labels: ["Pending", "Approved", "Rejected"],
    colors: chartColors,
    fill: {
      type: "gradient",
      gradient: {
        shade: themeMode === "dark" ? "dark" : "light",
        type: "diagonal1",
        shadeIntensity: 0.25,
        gradientToColors: themeMode === "dark" 
          ? ["#0891b2", "#059669", "#fb7185"]
          : ["#38bdf8", "#34d399", "#fda4af"],
        opacityFrom: 0.95,
        opacityTo: 0.75,
      }
    },
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
      labels: { colors: themeMode === "dark" ? "#94a3b8" : "#64748b", useSeriesColors: false },
    },
    stroke: { width: 0 },
    dataLabels: {
      style: { colors: ["#fff"], fontFamily: "Outfit", fontWeight: 600 },
    },
    plotOptions: {
      borderWidth: 0,
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "TOTAL",
              fontFamily: "Outfit",
              fontWeight: 700,
              color: themeMode === "dark" ? "#06b6d4" : "#0d9488",
              formatter: () => stats.pending + stats.approved + stats.rejected
            }
          }
        }
      }
    },
    theme: { mode: themeMode },
  };

  const pieSeries = [stats.pending, stats.approved, stats.rejected];

  const patientHighlightItems = [
    {
      title: "Hospital Branches",
      value: patientStats.totalBranches,
      icon: <Building2 size={20} />,
      gradient: "from-cyan-500/20 to-cyan-700/25 border-cyan-500/20",
      glowClass: "glow-cyan",
      subtitle: "Across the city locations",
    },
    {
      title: "Active Doctors",
      value: patientStats.totalDoctors,
      icon: <UserCheck size={20} />,
      gradient: "from-emerald-500/20 to-emerald-700/25 border-emerald-500/20",
      glowClass: "glow-emerald",
      subtitle: "Consulting specialists",
    },
    {
      title: "Primary Specialities",
      value: patientStats.totalSpecialists,
      icon: <Stethoscope size={20} />,
      gradient: "from-indigo-500/20 to-indigo-700/25 border-indigo-500/20",
      glowClass: "glow-indigo",
      subtitle: "Expert healthcare fields",
    },
    {
      title: "Support Nurses",
      value: patientStats.totalNurses,
      icon: <Users size={20} />,
      gradient: "from-purple-500/20 to-purple-700/25 border-purple-500/20",
      glowClass: "glow-purple",
      subtitle: "Full-time nursing staff",
    },
  ];

  const diseaseList = Array.from(
    new Set(
      branchDetails.flatMap((branch) =>
        branch.topDiseases.map((disease) => disease.trim())
      )
    )
  );

  const adminStatsItems = [
    {
      title: "Total Registered Patients",
      icon: <Users size={20} className="text-cyan-400" />,
      value: stats.patients,
      gradient: "from-cyan-550/20 to-cyan-700/25 border-cyan-500/30",
      glowClass: "glow-cyan",
      trend: "+12%",
    },
    {
      title: "Appointments Scheduled",
      icon: <Calendar size={20} className="text-purple-400" />,
      value: stats.todayAppointments,
      gradient: "from-purple-550/20 to-purple-700/25 border-purple-500/30",
      glowClass: "glow-purple",
      trend: "+8%",
    },
    {
      title: "Available Doctors",
      icon: <UserCheck size={20} className="text-emerald-400" />,
      value: stats.doctors,
      gradient: "from-emerald-550/20 to-emerald-700/25 border-emerald-500/30",
      glowClass: "glow-emerald",
      trend: "+2 new",
    },
    {
      title: "Month Revenue Estimate",
      icon: <DollarSign size={20} className="text-indigo-400" />,
      value: `₹${stats.revenue.toLocaleString()}`,
      gradient: "from-indigo-550/20 to-indigo-700/25 border-indigo-500/30",
      glowClass: "glow-indigo",
      trend: "+15%",
    },
  ];

  const quickLinks = [
    { icon: <Plus size={16} />, text: "Book Appointment", path: "/appointments", color: "from-cyan-500/20 to-cyan-900"},
    { icon: <Users size={16} />, text: "Patient Directory", path: "/patients", color: "from-purple-500/20 to-purple-700/25 border-purple-500/30 text-purple-400" },
    { icon: <FileText size={16} />, text: "Digital Invoicing", path: "/billing", color: "from-emerald-500/20 to-emerald-700/25 border-emerald-500/30 text-emerald-400" },
  ];

  const recentActivities = [
    { icon: "📅", text: "New appointment request placed", time: "2 mins ago", color: "border-cyan-500/30 text-cyan-400" },
    { icon: "👨‍⚕️", text: "Doctor availability calendar revised", time: "15 mins ago", color: "border-purple-500/30 text-purple-400" },
    { icon: "🧑‍🦱", text: "New patient verification completed", time: "1 hour ago", color: "border-emerald-500/30 text-emerald-400" },
    { icon: "💊", text: "Pharmacy invoice draft generated", time: "2 hours ago", color: "border-indigo-500/30 text-indigo-400" },
  ];

  return (
    <div className="p-5 md:p-8 space-y-8 select-none text-slate-200 relative overflow-hidden">
      
      {/* 🔮 Background Floating Ambient Aura Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-aura-1"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-aura-2"></div>

      {/* Welcome Banner / Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative z-10"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 radar-pulse-dot inline-block"></span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Operational</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase shimmer-text">
            {isPatient ? "Hospital Network Hub" : "HMS Administration Panel"}
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
            {isPatient 
              ? "Access city branches, specialist directories, cured counts, and verified reviews." 
              : "Overview of system status, patients flow, pending bookings, and hospital earnings."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white/3 border border-white/10 px-4.5 py-2.5 rounded-2xl shadow-sm backdrop-blur-md">
          <Clock size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-black text-xs uppercase tracking-widest">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* PATIENT VIEW */}
      {isPatient ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 relative z-10"
        >
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="skeleton-card p-6 flex justify-between items-start relative overflow-hidden">
                  <div className="space-y-2.5 w-2/3">
                    <div className="skeleton-box w-24 h-3.5 block"></div>
                    <div className="skeleton-box w-16 h-8 block mt-1.5"></div>
                    <div className="skeleton-box w-28 h-3 block mt-2"></div>
                  </div>
                  <div className="skeleton-box w-10 h-10 rounded-xl"></div>
                </div>
              ))
            ) : (
              patientHighlightItems.map((item, idx) => (
                <TiltCard key={idx} glowClass={item.glowClass}>
                  <div className="space-y-1 z-10">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">{item.title}</span>
                    <span className="text-3xl font-black text-white block mt-1">
                      <CountUp value={item.value} />
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold block mt-1">{item.subtitle}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl border ${item.gradient} flex items-center justify-center text-white z-10`}>
                    {item.icon}
                  </div>
                </TiltCard>
              ))
            )}
          </div>

          {/* Details & Branches Column */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Hospital details */}
            <div className="glass-card p-6 rounded-3xl xl:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Hospital Details</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">General Info</p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="text-slate-450 font-bold uppercase tracking-wider block text-[10px]">Entity Name</span>
                  <span className="font-extrabold text-white text-sm mt-0.5 block">{hospitalInfo.name}</span>
                </div>
                <div>
                  <span className="text-slate-455 font-bold uppercase tracking-wider block text-[10px]">About Care Network</span>
                  <p className="text-slate-300 mt-1 font-medium leading-relaxed">{hospitalInfo.about}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/3 border border-white/10 rounded-xl p-3">
                    <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest block">Established</span>
                    <span className="font-black text-cyan-300 text-sm mt-0.5 block">{hospitalInfo.established}</span>
                  </div>
                  <div className="bg-white/3 border border-white/10 rounded-xl p-3">
                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest block">Emergency</span>
                    <span className="font-black text-emerald-300 text-sm mt-0.5 block">{hospitalInfo.emergency}</span>
                  </div>
                </div>
                <div className="pt-2 divide-y divide-white/5">
                  <div className="py-2.5 flex justify-between font-medium">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Accreditations</span>
                    <span className="font-bold text-slate-200">{hospitalInfo.acaccreditation || hospitalInfo.accreditation}</span>
                  </div>
                  <div className="py-2.5 flex justify-between font-medium">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Helpline</span>
                    <span className="font-bold text-slate-200">{hospitalInfo.helpline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Branches Card */}
            <div className="glass-card p-6 rounded-3xl xl:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
                  <MapPin size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Branches & Availability</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Network Locations</p>
                </div>
              </div>

              <div className="space-y-4">
                {(branchDetails.length ? branchDetails : branchTemplates).map((branch) => (
                  <div
                    key={branch.id}
                    className="bg-white/2 border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">{branch.name}</h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{branch.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest block">Beds Available</span>
                        <span className="font-black text-white text-sm mt-0.5 block">{branch.beds}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      <div className="bg-white/3 border border-white/5 rounded-xl py-2 px-3 text-center">
                        <span className="text-[9px] text-slate-450 block font-bold uppercase tracking-wider">Doctors</span>
                        <span className="font-extrabold text-slate-250 text-xs mt-0.5 block">{branch.doctorCount}</span>
                      </div>
                      <div className="bg-white/3 border border-white/5 rounded-xl py-2 px-3 text-center">
                        <span className="text-[9px] text-slate-450 block font-bold uppercase tracking-wider">Specialities</span>
                        <span className="font-extrabold text-slate-250 text-xs mt-0.5 block">{branch.specialistCount}</span>
                      </div>
                      <div className="bg-white/3 border border-white/5 rounded-xl py-2 px-3 text-center">
                        <span className="text-[9px] text-slate-450 block font-bold uppercase tracking-wider">Nurses</span>
                        <span className="font-extrabold text-slate-255 text-xs mt-0.5 block">{branch.nurseCount}</span>
                      </div>
                      <div className="bg-white/3 border border-white/5 rounded-xl py-2 px-3 text-center">
                        <span className="text-[9px] text-slate-450 block font-bold uppercase tracking-wider">Cured</span>
                        <span className="font-black text-cyan-400 text-xs mt-0.5 block">{branch.diseasesCured}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Feedback & Disease cloud */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Condition Cloud */}
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Conditions Managed</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Successfully Treated</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {diseaseList.map((disease, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 rounded-full text-xs font-bold transition-colors cursor-default"
                  >
                    {disease}
                  </span>
                ))}
              </div>

              <div className="bg-white/3 border border-white/10 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-300 font-bold">
                  Total recovery cases across network: <span className="font-black text-cyan-400">{patientStats.totalDiseasesCured}</span>
                </p>
              </div>
            </div>

            {/* Reviews Card */}
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
                  <Star size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Patient Testimonials</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Verified Reviews</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {patientReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl border border-white/5 bg-white/2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-xs">{review.name}</span>
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-white/3 border border-white/10 p-4 rounded-xl">
                <span className="text-xs font-bold text-slate-400">Aggregate Rating</span>
                <span className="font-extrabold text-cyan-400 text-sm">
                  ★ {patientStats.averageRating} / 5
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      ) : (
        /* ADMIN & DOCTOR VIEW */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="skeleton-card p-6 flex justify-between items-start relative overflow-hidden">
                  <div className="space-y-2.5 w-2/3">
                    <div className="skeleton-box w-28 h-3.5 block"></div>
                    <div className="skeleton-box w-16 h-8 block mt-1.5"></div>
                    <div className="skeleton-box w-24 h-3 block mt-2"></div>
                  </div>
                  <div className="skeleton-box w-10 h-10 rounded-xl"></div>
                </div>
              ))
            ) : (
              adminStatsItems.map((item, idx) => (
                <TiltCard key={idx} glowClass={item.glowClass}>
                  <div className="space-y-2.5 z-10">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">{item.title}</span>
                    <span className="text-3xl font-black text-white block mt-1">
                      <CountUp value={item.value} />
                    </span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mt-1.5">
                      <TrendingUp size={14} />
                      <span>{item.trend}</span>
                      <span className="text-slate-550 font-bold text-[9px] uppercase tracking-widest">vs prev</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl border ${item.gradient} flex items-center justify-center text-white z-10`}>
                    {item.icon}
                  </div>
                </TiltCard>
              ))
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Appointments Bar Chart */}
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Appointment Bookings</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Category Metrics</p>
                </div>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  Monthly Log
                </span>
              </div>
              <div className="pt-2">
                <Chart options={barOptions} series={barSeries} type="bar" height={260} />
              </div>
            </div>

            {/* Status Pie Chart */}
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Status Distribution</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Proportion Breakdown</p>
                </div>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  Real-time
                </span>
              </div>
              <div className="pt-2 flex justify-center">
                <div className="w-full max-w-[320px]">
                  <Chart options={pieOptions} series={pieSeries} type="donut" height={260} />
                </div>
              </div>
            </div>

          </div>

          {/* Quick links & Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Quick Actions */}
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
                  <Plus size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Administrative Actions</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Task triggers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {quickLinks.map((link, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 6 }}
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-3.5 bg-white/2 border border-white/5 p-4 rounded-xl transition-all group hover:bg-white/5 border hover:border-cyan-500/30`}
                  >
                    <div className={`p-2 rounded-lg border ${link.color} bg-cyan-950/20 shadow-md`}>
                      {link.icon}
                    </div>
                    <span className="font-bold text-xs text-slate-250 group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                      {link.text}
                    </span>
                    <span className="ml-auto text-slate-450 group-hover:text-cyan-400 transition-colors font-bold">
                      →
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-cyan-500/20 text-cyan-400 flex items-center justify-center bg-cyan-950/10">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">System Audit Stream</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Latest updates</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {recentActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl border ${activity.color} flex items-center justify-center font-bold text-sm shadow-sm shrink-0 bg-white/3`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">
                        {activity.text}
                      </p>
                      <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}

export default Dashboard;