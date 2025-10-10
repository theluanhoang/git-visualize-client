'use client';

import { motion } from 'framer-motion';
import CommitGraph from '@/components/common/CommitGraph';

export default function CommitGraphPanel() {
  return (
    <motion.section 
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm p-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 flex items-center justify-center">
          <span className="text-[var(--primary)] text-sm">📊</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Commit Graph</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Xem trực quan các commit, nhánh và merge trong đồ thị.</p>
      <div className="rounded-md border border-[var(--border)] bg-background/80 backdrop-blur-[2px] p-2 shadow-inner">
        <div className="bg-[linear-gradient(transparent_23px,rgba(0,0,0,0.04)_24px),linear-gradient(90deg,transparent_23px,rgba(0,0,0,0.04)_24px)] bg-[length:24px_24px] bg-[position:0_0] dark:bg-[linear-gradient(transparent_23px,rgba(255,255,255,0.06)_24px),linear-gradient(90deg,transparent_23px,rgba(255,255,255,0.06)_24px)] rounded-md p-2 min-h-[280px]">
          <CommitGraph />
        </div>
      </div>
    </motion.section>
  );
}


