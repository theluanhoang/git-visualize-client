'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { LessonsService } from '@/services/lessons';
import LessonViewer from '@/components/common/git-theory/LessonViewer';

export default function LessonPage() {
    const router = useRouter();
    const { slug } = useParams<{ slug: string }>();
    const { data: lesson, isLoading, error } = useQuery({
        queryKey: ['git-theory-lesson', slug],
        queryFn: () => LessonsService.getBySlug(slug),
        enabled: Boolean(slug),
    });

    if (isLoading) return <div className="p-4">Đang tải bài học...</div>;
    if (error || !lesson) return <div className="p-4 text-red-500">Không tìm thấy bài học</div>;

    return (
        <div className="p-0">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-4 md:p-5 mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{lesson.title}</h1>
                {lesson.description && (
                    <p className="text-muted-foreground mt-1 text-sm md:text-base leading-relaxed">{lesson.description}</p>
                )}
            </div>
            <div className="-mx-0">
                <LessonViewer content={lesson.content} />
            </div>
        </div>
    );
}
