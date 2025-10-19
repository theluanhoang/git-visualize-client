'use client';

import Sidebar from '@/components/common/git-theory/Sidebar'
import Link from 'next/link';
import { useLessons } from '@/lib/react-query/hooks/use-lessons';
import React, { ReactNode } from 'react'
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {
    children: ReactNode;
};

function GitTheoryLayout({ children }: Props) {
    const { data: lessonsData, isLoading } = useLessons({
        limit: 100,
        offset: 0,
        status: 'published'
    });
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    const t = useTranslations('gitTheory.page');
    const tCommon = useTranslations('common');

    const data = lessonsData ? lessonsData
        .sort((a: any, b: any) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id ?? 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id ?? 0;
            return aTime - bTime; // oldest -> newest
        })
        .map((l: any) => ({ slug: l.slug, title: l.title, description: l.description ?? '' })) : [];

    return (
        <main className='container mx-auto mt-8 md:mt-10'>
            {}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-5 md:p-6">
                {}
                <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_20%_0%,#000_20%,transparent_70%)]">
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT)/15%,transparent_60%)]" />
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary.700)/10%,transparent_60%)]" />
                </div>

                <nav aria-label={t('breadcrumb')} className="relative text-xs md:text-sm text-muted-foreground">
                    <ol className="flex items-center gap-2">
                        <li><Link href={`/${locale}`} className="hover:underline">{tCommon('home')}</Link></li>
                        <li aria-hidden>›</li>
                        <li className="text-foreground font-medium">{tCommon('gitTheory')}</li>
                    </ol>
                </nav>
                <div className="relative mt-2 flex items-start gap-3">
                    <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20">
                        <span className="text-[var(--primary)] text-lg">⌘</span>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">{t('learnGitTitle')}</h1>
                        <p className="text-muted-foreground text-sm md:text-[0.95rem] leading-relaxed">{t('learnGitDescription')}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-6 md:gap-8">
                <Sidebar items={data ?? []} />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default GitTheoryLayout