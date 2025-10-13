'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useLessons, useDeleteLesson } from '@/lib/react-query/hooks/use-lessons';

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'archived', label: 'Đã lưu trữ' }
];

export default function LessonsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const { data: lessons = [], isLoading } = useLessons();
  const deleteLessonMutation = useDeleteLesson();

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openConfirmDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (pendingDeleteId == null) return;
    try {
      await deleteLessonMutation.mutateAsync(pendingDeleteId);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

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
          onView={async () => {
            try {
              const slug = row.slug;
              if (slug) {
                window.open(`/git-theory/${slug}`, '_blank', 'noopener,noreferrer');
                return;
              }
              console.warn('No slug available for this lesson row', row);
            } catch (e) {
              console.error('Failed to view lesson', e);
            }
          }}
          onEdit={() => {
            if (row.slug) {
              window.open(`/admin/lessons/${row.slug}/edit`, '_blank', 'noopener,noreferrer');
            } else {
              console.warn('No slug available to edit', row);
            }
          }}
          onDelete={() => openConfirmDelete(row.id)}
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

      {}
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

      {}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm bài học..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        showSortButton={true}
        onSortClick={() => {}}
      />

      {}
      <AdminTable 
        columns={lessonColumns}
        data={filteredLessons}
        emptyMessage="Không có bài học nào"
        onRowClick={async (lesson) => {
          try {
            if (lesson.slug) {
              window.open(`/git-theory/${lesson.slug}`, '_blank', 'noopener,noreferrer');
              return;
            }
            console.warn('No slug available for this lesson row', lesson);
          } catch (e) {
            console.error('Failed to navigate to lesson', e);
          }
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Xóa bài học?"
        description="Hành động này sẽ xóa bài học khỏi hệ thống. Bạn có chắc chắn?"
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteLessonMutation.isPending}
        onConfirm={performDelete}
        onClose={() => setConfirmOpen(false)}
      />

      {}
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
