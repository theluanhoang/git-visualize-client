'use client';

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

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
      transition={{ duration: 0.5 }} // animation fade-in nhanh, không delay
      viewport={{ once: true }}
    >
      <SectionTitle title="Tại sao chọn Git Visualized Engine?" description="Phương pháp học Git hiệu quả và thú vị" />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            className="bg-[color-mix(in_srgb,var(--surface),#000_4%)] rounded-lg border border-gray-200 shadow-sm p-6 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.15 }} // hover phản ứng ngay
          >
            <motion.div 
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-[var(--primary-600)] text-xl">{feature.icon}</span>
            </motion.div>
            <h3 className="font-semibold text-[var(--foreground)]">{feature.title}</h3>
            <p className="mt-2 text-sm text-[var(--foreground)]">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
