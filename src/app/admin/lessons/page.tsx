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
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-500/10 text-green-600 dark:text-green-400',
      draft: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      archived: 'bg-muted text-muted-foreground'
    };
    
    const labels = {
      published: 'Đã xuất bản',
      draft: 'Bản nháp',
      archived: 'Đã lưu trữ'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý bài học</h1>
          <p className="text-muted-foreground">Quản lý tất cả các bài học trong hệ thống</p>
        </div>
        <Link href="/admin/lessons/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm bài học mới
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Tổng bài học</p>
              <p className="text-xl font-semibold text-foreground">{lessons.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Đã xuất bản</p>
              <p className="text-xl font-semibold text-foreground">
                {lessons.filter(l => l.status === 'published').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Tổng lượt xem</p>
              <p className="text-xl font-semibold text-foreground">
                {lessons.reduce((sum, lesson) => sum + lesson.views, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Bản nháp</p>
              <p className="text-xl font-semibold text-foreground">
                {lessons.filter(l => l.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bài học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sắp xếp
            </Button>
          </div>
        </div>
      </Card>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => (
          <Card key={lesson.id} className="p-6">
            <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                {getStatusBadge(lesson.status)}
              </div>
              <p className="text-muted-foreground mb-3">{lesson.description}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{lesson.views} lượt xem</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{lesson.sections} phần</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Cập nhật: {lesson.updatedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{lesson.author}</span>
                </div>
              </div>
            </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/admin/lessons/${lesson.id}/preview`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/lessons/${lesson.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem trước
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy bài học</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Bắt đầu tạo bài học đầu tiên của bạn'
            }
          </p>
          <Link href="/admin/lessons/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm bài học mới
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
