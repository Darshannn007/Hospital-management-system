import { motion } from "framer-motion";

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/60 backdrop-blur-xl border border-white/30 
      p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-3xl font-bold text-[#072c2b] mt-2">
        {value}
      </p>
    </motion.div>
  );
}

export default StatCard;