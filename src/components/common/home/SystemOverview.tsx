'use client';

import OverviewCard from "@/components/common/home/OverviewCard";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { useTranslations } from 'next-intl';

export default function SystemOverview() {
  const t = useTranslations('home.systemOverview');
  
  const getBullets = (key: string): string[] => {
    const bullets = t(key);
    return bullets.split('\n').filter(Boolean);
  };
  
  return (
    <motion.section 
      aria-labelledby="system-title"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <SectionTitle title={t('title')} description={t('description')} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewCard
          icon="📚"
          title={t('gitTheory.title')}
          subtitle={t('gitTheory.subtitle')}
          description={t('gitTheory.description')}
          bullets={getBullets('gitTheory.bullets')}
          ctaHref="/git-theory"
          ctaLabel={t('gitTheory.ctaLabel')}
          delay={0.1}
        />

        <OverviewCard
          icon="💻"
          title={t('practiceLab.title')}
          subtitle={t('practiceLab.subtitle')}
          description={t('practiceLab.description')}
          bullets={getBullets('practiceLab.bullets')}
          ctaHref="/practice"
          ctaLabel={t('practiceLab.ctaLabel')}
          delay={0.2}
        />

        <OverviewCard
          icon="📊"
          title={t('commitGraph.title')}
          subtitle={t('commitGraph.subtitle')}
          description={t('commitGraph.description')}
          bullets={getBullets('commitGraph.bullets')}
          ctaHref="/practice"
          ctaLabel={t('commitGraph.ctaLabel')}
          delay={0.3}
        />
      </div>
    </motion.section>
  );
} 