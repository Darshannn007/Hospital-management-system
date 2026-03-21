import { motion } from "framer-motion";
import StatCard from "../components/StatCard";

function Dashboard() {
  const items = ["Patients", "Doctors", "Appointments", "Revenue"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        {items.map((item, i) => (<motion.div key={i} 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: "spring" }}>
            <StatCard title={item} value="--" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;