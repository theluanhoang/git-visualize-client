'use client';
import React from 'react';
import { getLessonBySlug, getLessonMetas, lessons } from '@/lib/git-theory/lessons';
import LessonContent from '@/components/common/git-theory/LessonContent';
import LessonNavigation from '@/components/common/git-theory/LessonNavigation';
import { getSlugFromPath } from '@/lib/git-theory/get-slug-from-path';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
    params: { slug: string };
};

export default function LessonPage({ params }: Props) {
    const metas = React.useMemo(() => getLessonMetas(), []);
    const pathname = usePathname();
    const navigate = useRouter();
    const [activeSlug, setActiveSlug] = React.useState<string>(getSlugFromPath(pathname));
    const activeIndex = metas.findIndex((m) => m.slug === activeSlug);
    const lesson = getLessonBySlug(params.slug);
    const activeLesson = getLessonBySlug(activeSlug) ?? lessons[0];

    function goPrev() {
        if (activeIndex > 0) {
            navigate.push(metas[activeIndex - 1].slug);
        };
    }

    function goNext() {
        if (activeIndex < metas.length - 1) {
            navigate.push(metas[activeIndex + 1].slug);
        };
    }
    
    if (!lesson) return <div>Lesson not found</div>;

    return (
        <div>
            <LessonContent lesson={activeLesson} />
            <LessonNavigation
                onPrev={goPrev}
                onNext={goNext}
                prevDisabled={activeIndex <= 0}
                nextDisabled={activeIndex >= metas.length - 1}
            />
        </div>
    );
}
