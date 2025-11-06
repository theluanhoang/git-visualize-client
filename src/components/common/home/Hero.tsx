'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { slides } from "@/services/mock-data";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";

const Carousel = dynamic(() => import("@/components/common/Carousel"), { ssr: false });

export default function Hero() {
  const t = useTranslations('home.hero');
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [searchQuery, setSearchQuery] = React.useState('');
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [isFocused, setIsFocused] = React.useState(false);

  const placeholders = React.useMemo(() => {
    try {
      const raw = t.raw('searchPlaceholders');
      if (Array.isArray(raw)) {
        return raw as string[];
      }
    } catch (e) { console.error(e); }

    return locale === 'vi' 
      ? ['Tìm kiếm: git init, commit, branch...']
      : ['Search: git init, commit, branch...'];
  }, [t, locale]);

  useEffect(() => {
    if (isFocused || searchQuery.length > 0) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isFocused, searchQuery.length, placeholders.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query.length > 0) {
      router.push(`/${locale}/git-theory?query=${encodeURIComponent(query)}`);
    } else {
      router.push(`/${locale}/git-theory`);
    }
  };

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
              {t('title')}
            </motion.h1>
            <motion.p 
              className="mt-2 sm:mt-3 text-white/90 text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('subtitle')}
            </motion.p>
            <motion.form 
              className="mt-4 sm:mt-6 max-w-xl"
              role="search" 
              aria-label={t('searchLabel')}
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Label htmlFor="landing-search" className="sr-only">{t('searchLabel')}</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none z-10" />
                  <Input
                    id="landing-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholders[placeholderIndex]}
                    className="w-full pl-10 pr-3 sm:px-4 sm:pl-10 py-2 !h-auto !bg-white/95 text-gray-900 placeholder:text-gray-600 !border-white/60 text-sm !shadow-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus:outline-none transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  className="px-4 sm:px-5 py-2.5 bg-white text-[var(--primary)] hover:bg-white/90 dark:bg-[var(--primary)] dark:text-[var(--primary-foreground)] dark:hover:bg-[var(--primary-700)] shadow-lg"
                >
                  {t('searchButton')}
                </Button>
              </div>
            </motion.form>
            <motion.div 
              className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                asChild
                variant="default"
                size="default"
                className="px-4 sm:px-5 py-2.5 bg-white text-[var(--primary)] hover:bg-white/90 dark:bg-[var(--primary)] dark:text-[var(--primary-foreground)] dark:hover:bg-[var(--primary-700)] shadow-lg"
              >
                <Link href={`/${locale}/git-theory`}>
                  {t('startLearning')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="px-4 sm:px-5 py-2.5 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 hover:border-white dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white/15 shadow-lg"
              >
                <Link href={`/${locale}/git-theory`}>
                  {t('explorePath')}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 