'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { slides } from "@/services/mock-data";

const Carousel = dynamic(() => import("@/components/common/Carousel"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative">
      <Carousel
        fullBleed
        heightClass="h-[280px] sm:h-[420px] md:h-[520px]"
        slides={slides}
        intervalMs={4500}
      />
      {}
      <div className="pointer-events-none absolute inset-0 bg-black/50 z-10" />
      {}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-3xl text-white">
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Học Git nhanh, trực quan, miễn phí
            </motion.h1>
            <motion.p 
              className="mt-2 sm:mt-3 text-white/90 text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Lộ trình học Git từng bước, ví dụ rõ ràng, thực hành trực tiếp. Bắt đầu từ cơ bản đến nâng cao.
            </motion.p>
            <motion.form 
              className="mt-4 sm:mt-6 max-w-xl"
              role="search" 
              aria-label="Tìm kiếm nội dung"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label htmlFor="landing-search" className="sr-only">Tìm kiếm bài học Git</label>
              <div className="flex items-center gap-2">
                <input
                  id="landing-search"
                  type="search"
                  placeholder="Tìm kiếm: git init, commit, branch..."
                  className="flex-1 px-3 sm:px-4 py-2 rounded-md bg-white/95 text-gray-900 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] border border-white/60 text-sm"
                />
                <Link
                  href="/git-theory"
                  className="px-4 sm:px-5 py-2.5 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:bg-[var(--primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Tìm kiếm
                </Link>
              </div>
            </motion.form>
            <motion.div 
              className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/git-theory" className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:bg-[var(--primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                Bắt đầu học ngay
              </Link>
              <Link href="/git-theory" className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-md border border-white/70 bg-white/10 text-white text-sm font-medium hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                Khám phá lộ trình
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 