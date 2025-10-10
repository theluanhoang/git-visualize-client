'use client';

import { motion } from 'framer-motion';
import TerminalWrapper from '@/components/common/terminal/TerminalWrapper';

export default function TerminalPanel() {
  return (
    <motion.section 
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 flex items-center justify-center">
          <span className="text-[var(--primary)] text-sm">💻</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Terminal Git</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Thực thi các lệnh Git và xem kết quả ngay lập tức.</p>
      <TerminalWrapper />
    </motion.section>
  );
}


