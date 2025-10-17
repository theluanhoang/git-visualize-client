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
import { useIsAuthenticated } from '@/lib/react-query/hooks/use-auth';
import AdminWelcomeBanner from '@/components/admin/AdminWelcomeBanner';
import { useDashboardStats, useRecentUsers, useRecentLessons } from '@/lib/react-query/hooks/use-analytics';


export default function AdminDashboard() {
  const router = useRouter();
  const deleteLessonMutation = useDeleteLesson();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const { user } = useIsAuthenticated();

  // Fetch real data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentUsers, isLoading: usersLoading } = useRecentUsers(3);
  const { data: recentLessonsData, isLoading: lessonsLoading } = useRecentLessons(10);


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
    { key: 'role', label: 'Vai trò', render: (value: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
        value === 'instructor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }`}>
        {value === 'admin' ? 'Admin' : value === 'instructor' ? 'Instructor' : 'Student'}
      </span>
    )},
    { key: 'joinedAt', label: 'Tham gia', render: (value: string) => <DateDisplay date={value} /> },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (value: any, row: any) => (
        <ActionButtons 
          onView={() => {}}
          onEdit={() => {}}
        />
      )
    },
  ];

  return (
    <div className="space-y-6">
      <AdminWelcomeBanner userName={user?.firstName} />
      
      <PageHeader 
        title={`Chào mừng, ${user?.firstName || 'Admin'}! 👋`}
        description="Bảng điều khiển quản trị hệ thống Git Learning Platform"
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
          value={statsLoading ? '...' : stats?.totalLessons || 0}
          icon={BookOpen}
          color="text-blue-500"
        />
        <StatCard
          title="Người dùng"
          value={statsLoading ? '...' : stats?.totalUsers || 0}
          icon={Users}
          color="text-green-500"
        />
        <StatCard
          title="Lượt xem"
          value={statsLoading ? '...' : stats?.totalViews || 0}
          icon={Eye}
          color="text-purple-500"
        />
        <StatCard
          title="Hoạt động gần đây"
          value={statsLoading ? '...' : stats?.recentActivity || 0}
          icon={TrendingUp}
          color="text-orange-500"
        />
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {}
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
            data={lessonsLoading ? [] : recentLessonsData ?? []}
            emptyMessage={lessonsLoading ? "Đang tải..." : "Chưa có bài học nào"}
          />
        </Card>

        {}
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
            data={usersLoading ? [] : (recentUsers?.users ?? [])}
            emptyMessage={usersLoading ? "Đang tải..." : "Chưa có người dùng nào"}
          />
        </Card>
      </div>

      {}
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
