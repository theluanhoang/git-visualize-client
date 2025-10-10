'use client';

import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard, AdminTable, ActionButtons, StatusBadge, DateDisplay } from '@/components/admin';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { LessonsService } from '@/services/lessons';
import { useDeleteLesson } from '@/lib/react-query/hooks/use-lessons';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock data - trong thực tế sẽ fetch từ API
const stats = {
  totalLessons: 24,
  totalUsers: 156,
  totalViews: 2847,
  recentActivity: 8
};

// Fetched recent lessons from backend

const recentUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', joinedAt: '2024-01-15', lessonsCompleted: 5 },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', joinedAt: '2024-01-14', lessonsCompleted: 3 },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', joinedAt: '2024-01-13', lessonsCompleted: 8 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const deleteLessonMutation = useDeleteLesson();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const { data: recentLessonsData } = useQuery({
    queryKey: ['admin-recent-lessons'],
    queryFn: async () => {
      // Get latest 10 lessons, sorted by createdAt DESC by backend, limit capped in service
      const res = await LessonsService.getAll({ limit: 10, offset: 0 });
      return res.data.map((l: any) => ({
        id: l.id,
        title: l.title,
        status: l.status,
        views: l.views ?? 0,
        lastModified: l.updatedAt ?? l.createdAt,
        slug: l.slug,
      }));
    },
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
    } catch (e) {
      console.error('Failed to delete lesson', e);
    }
  };
  const lessonColumns = [
    { key: 'title', label: 'Tiêu đề', render: (value: string) => (
      <span className="block max-w-[280px] truncate" title={value}>{value}</span>
    ) },
    { key: 'status', label: 'Trạng thái', render: (value: string) => <StatusBadge status={value as any} /> },
    { key: 'views', label: 'Lượt xem' },
    { key: 'lastModified', label: 'Cập nhật cuối', render: (value: string) => <DateDisplay date={value} /> },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (value: any, row: any) => (
        <ActionButtons 
          onView={() => {
            if (row.slug) window.open(`/git-theory/${row.slug}`, '_blank', 'noopener,noreferrer');
          }}
          onEdit={() => {
            if (row.slug) window.open(`/admin/lessons/${row.slug}/edit`, '_blank', 'noopener,noreferrer');
          }}
          onDelete={() => openConfirmDelete(row.id)}
        />
      )
    },
  ];

  const userColumns = [
    { key: 'name', label: 'Tên' },
    { key: 'email', label: 'Email' },
    { key: 'lessonsCompleted', label: 'Bài học hoàn thành' },
    { key: 'joinedAt', label: 'Tham gia', render: (value: string) => <DateDisplay date={value} /> },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (value: any, row: any) => (
        <ActionButtons 
          onView={() => console.log('View user', row.id)}
          onEdit={() => console.log('Edit user', row.id)}
        />
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard"
        description="Tổng quan về hệ thống quản lý bài học"
        actions={
          <Link href="/admin/lessons/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm bài học mới
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng bài học"
          value={stats.totalLessons}
          icon={BookOpen}
          color="text-blue-500"
        />
        <StatCard
          title="Người dùng"
          value={stats.totalUsers}
          icon={Users}
          color="text-green-500"
        />
        <StatCard
          title="Lượt xem"
          value={stats.totalViews}
          icon={Eye}
          color="text-purple-500"
        />
        <StatCard
          title="Hoạt động gần đây"
          value={stats.recentActivity}
          icon={TrendingUp}
          color="text-orange-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Lessons */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Bài học gần đây</h3>
            <Link href="/admin/lessons">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </div>
          <AdminTable 
            columns={lessonColumns}
            data={recentLessonsData ?? []}
            emptyMessage="Chưa có bài học nào"
          />
        </Card>

        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Người dùng mới</h3>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </div>
          <AdminTable 
            columns={userColumns}
            data={recentUsers}
            emptyMessage="Chưa có người dùng nào"
          />
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/lessons/new">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Tạo bài học mới</span>
            </Button>
          </Link>
          <Link href="/admin/lessons">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Quản lý bài học</span>
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span>Quản lý người dùng</span>
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Xem báo cáo</span>
            </Button>
          </Link>
        </div>
      </Card>
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
    </div>
  );
}
