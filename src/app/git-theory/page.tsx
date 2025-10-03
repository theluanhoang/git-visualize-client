'use client';

import Link from 'next/link'
import React, { useEffect } from 'react'
import { getLessonBySlug, getLessonMetas, lessons } from "@/lib/git-theory/lessons";
import Sidebar from '@/components/git-theory/Sidebar';
import { useRouter } from 'next/router';

function GitTheoryPage() {
    const router = useRouter();
    const metas = React.useMemo(() => getLessonMetas(), []);
    const [activeSlug, setActiveSlug] = React.useState<string>(metas[0]?.slug ?? "git-intro");
	const activeIndex = metas.findIndex((m) => m.slug === activeSlug);
	const activeLesson = getLessonBySlug(activeSlug) ?? lessons[0];

    useEffect(() => {
        router.query.slug = activeSlug;
        router.push(router)
    }, [activeSlug]);
    
	function goPrev() {
		if (activeIndex > 0) setActiveSlug(metas[activeIndex - 1].slug);
	}

	function goNext() {
		if (activeIndex < metas.length - 1) setActiveSlug(metas[activeIndex + 1].slug);
	}
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
					<Sidebar items={metas} activeSlug={activeSlug} onSelect={setActiveSlug} />
					<div className="flex-1">
						
					</div>
				</div>
        </main>
    )
}

export default GitTheoryPage