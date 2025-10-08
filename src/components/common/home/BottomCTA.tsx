'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function BottomCTA() {
  return (
    <motion.section 
      className="mt-16 bg-[color-mix(in_srgb,var(--surface),#000_4%)] rounded-lg border border-gray-200 shadow-sm p-8 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-semibold text-[var(--foreground)]">Sẵn sàng trở thành Git Master?</h2>
      <p className="text-[var(--foreground)] mt-2">Bắt đầu hành trình học Git ngay hôm nay và nâng cao kỹ năng lập trình của bạn.</p>
      <motion.div 
        className="mt-6 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Link href="/git-theory" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:bg-[var(--primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] shadow-sm hover:shadow-md transition-all">
          Bắt đầu học ngay
        </Link>
        <Link href="/practice" className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] shadow-sm hover:shadow-md transition-all">
          Thực hành ngay
        </Link>
      </motion.div>
    </motion.section>
  );
} 