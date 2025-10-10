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
import Link from 'next/link';

// Mock data - trong thực tế sẽ fetch từ API
const stats = {
  totalLessons: 24,
  totalUsers: 156,
  totalViews: 2847,
  recentActivity: 8
};

const recentLessons = [
  { id: 1, title: 'Git Basics - Introduction', status: 'published', views: 45, lastModified: '2024-01-15' },
  { id: 2, title: 'Advanced Git Workflows', status: 'draft', views: 0, lastModified: '2024-01-14' },
  { id: 3, title: 'Git Branching Strategies', status: 'published', views: 32, lastModified: '2024-01-13' },
  { id: 4, title: 'Git Hooks and Automation', status: 'published', views: 28, lastModified: '2024-01-12' },
];

const recentUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', joinedAt: '2024-01-15', lessonsCompleted: 5 },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', joinedAt: '2024-01-14', lessonsCompleted: 3 },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', joinedAt: '2024-01-13', lessonsCompleted: 8 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về hệ thống quản lý bài học</p>
        </div>
        <Link href="/admin/lessons/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm bài học mới
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Tổng bài học</p>
              <p className="text-2xl font-semibold text-foreground">{stats.totalLessons}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Người dùng</p>
              <p className="text-2xl font-semibold text-foreground">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Lượt xem</p>
              <p className="text-2xl font-semibold text-foreground">{stats.totalViews}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Hoạt động gần đây</p>
              <p className="text-2xl font-semibold text-foreground">{stats.recentActivity}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Lessons */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Bài học gần đây</h3>
            <Link href="/admin/lessons">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lesson.status === 'published' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {lesson.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                    <span className="text-xs text-muted-foreground">{lesson.views} lượt xem</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Người dùng mới</h3>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {user.lessonsCompleted} bài học hoàn thành
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Tham gia: {user.joinedAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
