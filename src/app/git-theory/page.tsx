'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { LessonsService } from '@/services/lessons';

export default function GitTheoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['git-theory-lessons'],
    queryFn: async () => {
      const res = await LessonsService.getAll({ limit: 100, offset: 0, status: 'published' });
      return res.data;
    },
  });

  if (isLoading) return <div className="p-4">Đang tải bài học...</div>;
  if (error) return <div className="p-4 text-red-500">Không tải được danh sách bài học.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách bài học</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((lesson: any) => (
          <Link key={lesson.id ?? lesson.slug} href={`/git-theory/${lesson.slug}`} className="block border rounded-md p-4 hover:bg-muted/40">
            <h2 className="font-semibold text-lg">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{lesson.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}