'use client';

import OverviewCard from "@/components/home/OverviewCard";
import { motion } from "framer-motion";

export default function SystemOverview() {
  return (
    <motion.section 
      aria-labelledby="system-title"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 id="system-title" className="text-xl font-semibold text-gray-900 text-center">Hệ thống học Git toàn diện</h2>
      <p className="text-gray-700 text-center mt-2">Kết hợp lý thuyết, thực hành và trực quan hóa để học Git hiệu quả nhất</p>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewCard
          icon="📚"
          title="Git Theory"
          subtitle="Lý thuyết có cấu trúc"
          description="Học Git từ cơ bản đến nâng cao với các bài học được thiết kế khoa học, ví dụ rõ ràng và code examples có thể copy."
          bullets={["Bài học từng bước", "Code examples tương tác", "Sidebar điều hướng"]}
          ctaHref="/git-theory"
          ctaLabel="Bắt đầu học"
          delay={0.1}
        />

        <OverviewCard
          icon="💻"
          title="Practice Lab"
          subtitle="Thực hành trực tiếp"
          description="Terminal Git thực tế để thực thi lệnh và xem kết quả ngay lập tức. Không cần cài đặt gì thêm."
          bullets={["Terminal Git thực tế", "Kết quả tức thì", "Môi trường an toàn"]}
          ctaHref="/practice"
          ctaLabel="Thực hành ngay"
          delay={0.2}
        />

        <OverviewCard
          icon="📊"
          title="Commit Graph"
          subtitle="Trực quan hóa"
          description="Đồ thị commit tương tác giúp bạn hiểu rõ cấu trúc repository, nhánh và lịch sử thay đổi."
          bullets={["Đồ thị tương tác", "Hiển thị nhánh & merge", "Cập nhật real-time"]}
          ctaHref="/practice"
          ctaLabel="Xem đồ thị"
          delay={0.3}
        />
      </div>
    </motion.section>
  );
} 