'use client';

import { motion } from "framer-motion";

const features = [
  { icon: "🎯", title: "Lộ trình rõ ràng", desc: "Từ cơ bản đến nâng cao, mỗi bước đều được thiết kế để bạn tiến bộ." },
  { icon: "⚡", title: "Học nhanh", desc: "Kết hợp lý thuyết, thực hành và trực quan hóa để ghi nhớ lâu hơn." },
  { icon: "🆓", title: "Hoàn toàn miễn phí", desc: "Không cần đăng ký, không quảng cáo, học Git hoàn toàn miễn phí." }
];

export default function Features() {
  return (
    <motion.section 
      aria-labelledby="features-title" 
      className="mt-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 id="features-title" className="text-xl font-semibold text-gray-900 text-center">Tại sao chọn Git Visualized Engine?</h2>
      <p className="text-gray-700 text-center mt-2">Phương pháp học Git hiệu quả và thú vị</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-[var(--primary-600)] text-xl">{feature.icon}</span>
            </motion.div>
            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
} 