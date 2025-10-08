'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import TerminalWrapper from "@/components/common/terminal/TerminalWrapper";
import CommitGraph from "@/components/common/CommitGraph";
import StagingAreaVisualizer from "@/components/common/git-theory/StagingAreaVisualizer";

export default function PracticePage() {
  return (
    <div className="">
      <main className="container mx-auto mt-10 px-4">
        {/* Header */}
        <motion.section 
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Git Practice Lab</h1>
              <p className="text-gray-700 mt-1">Thực hành các lệnh Git bạn đã học với terminal và xem kết quả trên đồ thị commit.</p>
            </div>
            <Link 
              href="/git-theory" 
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              ← Quay lại lý thuyết
            </Link>
          </div>
        </motion.section>

        {/* Practice Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Terminal Section */}
          <motion.section 
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center">
                <span className="text-[var(--primary-600)] text-sm">💻</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Terminal Git</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Thực thi các lệnh Git và xem kết quả ngay lập tức.</p>
            <TerminalWrapper />
          </motion.section>

          {/* Commit Graph Section */}
          <motion.section 
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center">
                <span className="text-[var(--primary-600)] text-sm">📊</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Commit Graph</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Xem trực quan các commit, nhánh và merge trong đồ thị.</p>
            <CommitGraph />
          </motion.section>
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
        <motion.section 
          className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Mẹo thực hành</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Bắt đầu với:</h4>
              <ul className="space-y-1">
                <li>• <code className="bg-gray-100 px-1 rounded">git init</code> - Khởi tạo repository</li>
                <li>• <code className="bg-gray-100 px-1 rounded">git add .</code> - Thêm tất cả file</li>
                <li>• <code className="bg-gray-100 px-1 rounded">git commit -m &quot;message&quot;</code> - Tạo commit</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Thử nghiệm:</h4>
              <ul className="space-y-1">
                <li>• <code className="bg-gray-100 px-1 rounded">git branch feature</code> - Tạo nhánh mới</li>
                <li>• <code className="bg-gray-100 px-1 rounded">git merge feature</code> - Hợp nhất nhánh</li>
                <li>• <code className="bg-gray-100 px-1 rounded">git log --oneline</code> - Xem lịch sử</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
