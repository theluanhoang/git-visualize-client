'use client';

import  {motion } from 'framer-motion'
import StagingAreaVisualizer from "@/components/common/git-theory/StagingAreaVisualizer";
import PracticeHeader from "@/components/common/practice/PracticeHeader";
import TerminalPanel from "@/components/common/practice/TerminalPanel";
import CommitGraphPanel from "@/components/common/practice/CommitGraphPanel";
import PracticeTips from "@/components/common/practice/PracticeTips";

export default function PracticePage() {
  return (
    <div className="">
      <main className="container mx-auto mt-10 px-4">
        <PracticeHeader />

        {/* Practice Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Terminal Section */}
          <TerminalPanel />

          {/* Commit Graph Section */}
          <CommitGraphPanel />
        </div>

        {/* Staging Area Visualizer */}
        <motion.section 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <StagingAreaVisualizer />
        </motion.section>

        {/* Practice Tips */}
        <PracticeTips />
      </main>
    </div>
  );
}
