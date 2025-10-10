'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  BookOpen,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, AdminTable, ActionButtons, StatusBadge, DateDisplay, StatCard, FilterBar, EmptyState } from '@/components/admin';

// Mock data - trong thực tế sẽ fetch từ API
const lessons = [
  {
    id: 1,
    slug: 'git-basics-introduction',
    title: 'Git Basics - Introduction',
    description: 'Học những khái niệm cơ bản về Git và version control',
    status: 'published',
    views: 245,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    author: 'Admin',
    sections: 4,
    estimatedTime: '30 phút'
  },
  {
    id: 2,
    slug: 'advanced-git-workflows',
    title: 'Advanced Git Workflows',
    description: 'Tìm hiểu các workflow nâng cao trong Git',
    status: 'draft',
    views: 0,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    author: 'Admin',
    sections: 6,
    estimatedTime: '45 phút'
  },
  {
    id: 3,
    slug: 'git-branching-strategies',
    title: 'Git Branching Strategies',
    description: 'Các chiến lược branching phổ biến trong phát triển phần mềm',
    status: 'published',
    views: 189,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    author: 'Admin',
    sections: 5,
    estimatedTime: '40 phút'
  },
  {
    id: 4,
    slug: 'git-hooks-automation',
    title: 'Git Hooks and Automation',
    description: 'Sử dụng Git hooks để tự động hóa quy trình phát triển',
    status: 'published',
    views: 156,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    author: 'Admin',
    sections: 3,
    estimatedTime: '25 phút'
  },
  {
    id: 5,
    slug: 'git-collaboration',
    title: 'Git Collaboration Best Practices',
    description: 'Các thực hành tốt nhất khi làm việc nhóm với Git',
    status: 'archived',
    views: 98,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    author: 'Admin',
    sections: 7,
    estimatedTime: '50 phút'
  }
];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'archived', label: 'Đã lưu trữ' }
];

export default function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const lessonColumns = [
    { key: 'title', label: 'Tiêu đề' },
    { key: 'status', label: 'Trạng thái', render: (value: string) => <StatusBadge status={value as any} /> },
    { key: 'views', label: 'Lượt xem' },
    { key: 'author', label: 'Tác giả' },
    { key: 'updatedAt', label: 'Cập nhật cuối', render: (value: string) => <DateDisplay date={value} /> },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (value: any, row: any) => (
        <ActionButtons 
          onView={() => console.log('View lesson', row.id)}
          onEdit={() => console.log('Edit lesson', row.id)}
          onDelete={() => console.log('Delete lesson', row.id)}
        />
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quản lý bài học"
        description="Quản lý tất cả các bài học trong hệ thống"
        actions={
          <Link href="/admin/lessons/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm bài học mới
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng bài học"
          value={lessons.length}
          icon={BookOpen}
          color="text-blue-500"
        />
        <StatCard
          title="Đã xuất bản"
          value={lessons.filter(l => l.status === 'published').length}
          icon={Eye}
          color="text-green-500"
        />
        <StatCard
          title="Tổng lượt xem"
          value={lessons.reduce((sum, lesson) => sum + lesson.views, 0)}
          icon={TrendingUp}
          color="text-purple-500"
        />
        <StatCard
          title="Bản nháp"
          value={lessons.filter(l => l.status === 'draft').length}
          icon={Calendar}
          color="text-orange-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm bài học..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        showSortButton={true}
        onSortClick={() => console.log('Sort clicked')}
      />

      {/* Lessons List */}
      <AdminTable 
        columns={lessonColumns}
        data={filteredLessons}
        emptyMessage="Không có bài học nào"
        onRowClick={(lesson) => console.log('Row clicked', lesson.id)}
      />

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Không tìm thấy bài học"
          description={
            searchTerm || statusFilter !== 'all' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Bắt đầu tạo bài học đầu tiên của bạn'
          }
          actionLabel="Thêm bài học mới"
          actionIcon={Plus}
          onAction={() => window.location.href = '/admin/lessons/new'}
        />
      )}
    </div>
  );
}
