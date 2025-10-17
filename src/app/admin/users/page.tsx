'use client';

import { useState } from 'react';
import { 
  UserCheck,
  BookOpen,
  TrendingUp,
  Shield
} from 'lucide-react';
import { PageHeader, AdminTable, ActionButtons, StatusBadge, DateDisplay, StatCard, FilterBar, EmptyState, UserList } from '@/components/admin';
import { useUsers as useUsersQuery, useDeleteUser, useUpdateUserStatus } from '@/lib/react-query/hooks/use-analytics';

// options map to backend values

const roleOptions = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'USER', label: 'Người dùng' },
  { value: 'ADMIN', label: 'Quản trị viên' }
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
  const [sortBy, setSortBy] = useState('createdAt');

  const { data, isLoading } = useUsersQuery({
    page: 1,
    limit: 50,
    search: searchTerm || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy,
    sortOrder: 'DESC'
  });
  const users = (data?.users ?? []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role === 'ADMIN' ? 'admin' : 'user',
    status: u.status,
    joinedAt: u.joinedAt,
  }));

  const filteredUsers = users; // server already filters

  const deleteUserMutation = useDeleteUser();
  const toggleUserStatusMutation = useUpdateUserStatus();

  const handleDeleteUser = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (user: any) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await toggleUserStatusMutation.mutateAsync({ userId: user.id, isActive: newStatus === 'active' });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quản lý người dùng"
        description="Quản lý tất cả người dùng trong hệ thống"
      />

      {}
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
        title="Người dùng"
        value={users.filter(u => u.role === 'user').length}
        icon={BookOpen}
        color="text-purple-500"
      />
      <StatCard
        title="Quản trị viên"
        value={users.filter(u => u.role === 'admin').length}
        icon={Shield}
        color="text-orange-500"
      />
      </div>

      {}
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
        onSortClick={() => {}}
      />

      {}
      <UserList
        users={filteredUsers}
        onView={(user) => {}}
        onEdit={(user) => {}}
        onDelete={(user) => handleDeleteUser(user.id)}
        onToggleStatus={handleToggleUserStatus}
        onSendEmail={(user) => {}}
      />

      {}
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
