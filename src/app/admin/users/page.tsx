'use client';

import { useState } from 'react';
import { 
  UserCheck,
  BookOpen,
  TrendingUp,
  Shield
} from 'lucide-react';
import { PageHeader, AdminTable, ActionButtons, StatusBadge, DateDisplay, StatCard, FilterBar, EmptyState, UserList } from '@/components/admin';

// Mock data - trong thực tế sẽ fetch từ API
const users: Array<{
  id: number;
  name: string;
  email: string;
  avatar: null;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  joinedAt: string;
  lastActive: string;
  lessonsCompleted: number;
  totalTimeSpent: string;
  progress: number;
  achievements: number;
}> = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: null,
    role: 'student',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-01-20',
    lessonsCompleted: 5,
    totalTimeSpent: '2h 30m',
    progress: 75,
    achievements: 3
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    avatar: null,
    role: 'student',
    status: 'active',
    joinedAt: '2024-01-14',
    lastActive: '2024-01-19',
    lessonsCompleted: 3,
    totalTimeSpent: '1h 45m',
    progress: 45,
    achievements: 1
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    avatar: null,
    role: 'instructor',
    status: 'active',
    joinedAt: '2024-01-10',
    lastActive: '2024-01-20',
    lessonsCompleted: 8,
    totalTimeSpent: '4h 15m',
    progress: 100,
    achievements: 5
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    avatar: null,
    role: 'student',
    status: 'inactive',
    joinedAt: '2024-01-05',
    lastActive: '2024-01-12',
    lessonsCompleted: 2,
    totalTimeSpent: '1h 20m',
    progress: 25,
    achievements: 0
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    avatar: null,
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-01',
    lastActive: '2024-01-20',
    lessonsCompleted: 12,
    totalTimeSpent: '6h 30m',
    progress: 100,
    achievements: 8
  }
];

const roleOptions = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'student', label: 'Học viên' },
  { value: 'instructor', label: 'Giảng viên' },
  { value: 'admin', label: 'Quản trị viên' }
];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'banned', label: 'Bị cấm' }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinedAt');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quản lý người dùng"
        description="Quản lý tất cả người dùng trong hệ thống"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng người dùng"
          value={users.length}
          icon={UserCheck}
          color="text-blue-500"
        />
        <StatCard
          title="Hoạt động"
          value={users.filter(u => u.status === 'active').length}
          icon={TrendingUp}
          color="text-green-500"
        />
        <StatCard
          title="Học viên"
          value={users.filter(u => u.role === 'student').length}
          icon={BookOpen}
          color="text-purple-500"
        />
        <StatCard
          title="Giảng viên"
          value={users.filter(u => u.role === 'instructor').length}
          icon={Shield}
          color="text-orange-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm người dùng..."
        filters={[
          {
            id: 'role',
            label: 'Lọc theo vai trò',
            value: roleFilter,
            onChange: setRoleFilter,
            options: roleOptions
          },
          {
            id: 'status',
            label: 'Lọc theo trạng thái',
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions
          }
        ]}
        showSortButton={true}
        onSortClick={() => console.log('Sort clicked')}
      />

      {/* Users List */}
      <UserList
        users={filteredUsers}
        onView={(user) => console.log('View user', user.id)}
        onEdit={(user) => console.log('Edit user', user.id)}
        onDelete={(user) => console.log('Delete user', user.id)}
        onToggleStatus={(user) => console.log('Toggle status', user.id)}
        onSendEmail={(user) => console.log('Send email', user.id)}
      />

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <EmptyState
          icon={UserCheck}
          title="Không tìm thấy người dùng"
          description={
            searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Chưa có người dùng nào trong hệ thống'
          }
        />
      )}
    </div>
  );
}
