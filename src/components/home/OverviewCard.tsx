'use client';

import Link from "next/link";
import { motion } from "framer-motion";

type OverviewCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  ctaHref: string;
  ctaLabel: string;
  delay?: number;
};

export default function OverviewCard({ icon, title, subtitle, description, bullets, ctaHref, ctaLabel, delay = 0 }: OverviewCardProps) {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-[var(--primary-600)] text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-4">{description}</p>
      <div className="space-y-2 text-xs text-gray-600">
        {bullets.map((b) => (
          <div key={b} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
            <span>{b}</span>
          </div>
        ))}
      </div>
      <Link 
        href={ctaHref}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:bg-[var(--primary-700)] transition-colors"
      >
        <span>{ctaLabel}</span>
        <span>→</span>
      </Link>
    </motion.div>
  );
} 