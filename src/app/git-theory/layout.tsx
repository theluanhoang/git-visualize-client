'use client';

import Sidebar from '@/components/common/git-theory/Sidebar'
import { getLessonBySlug, getLessonMetas, lessons } from '@/lib/git-theory/lessons';
import Link from 'next/link';
import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode;
};

function GitTheoryLayout({ children }: Props) {
    const metas = React.useMemo(() => getLessonMetas(), []);

    return (
        <main className='container mx-auto mt-10'>
            {/* TOP INFORMATION */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="hover:underline">Home</Link></li>
                        <li aria-hidden>›</li>
                        <li className="text-gray-900 font-medium">Git Theory</li>
                    </ol>
                </nav>
                <h1 className="mt-1 text-xl font-semibold text-gray-900">Learn Git: Concepts and Commands</h1>
                <p className="text-gray-700 text-sm">Structured lessons, examples, and visuals to master Git fundamentals.</p>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-6">
                <Sidebar items={metas} />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default GitTheoryLayout