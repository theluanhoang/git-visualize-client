import { LessonsService } from './lessons';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export interface DashboardStats {
  totalLessons: number;
  totalUsers: number;
  totalViews: number;
  recentActivity: number;
}

export interface RecentUser extends User {}

export interface RecentLesson {
  id: number;
  title: string;
  status: string;
  views: number;
  lastModified: string;
  slug: string;
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const AnalyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/v1/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalLessons: 0,
        totalUsers: 0,
        totalViews: 0,
        recentActivity: 0
      };
    }
  },

  async getRecentLessons(limit: number = 10): Promise<RecentLesson[]> {
    try {
      const response = await LessonsService.getAll({ limit, offset: 0 });
      const lessons = response.data || [];
      
      return lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        status: lesson.status,
        views: lesson.views || 0,
        lastModified: lesson.updatedAt || lesson.createdAt,
        slug: lesson.slug
      }));
    } catch (error) {
      console.error('Error fetching recent lessons:', error);
      return [];
    }
  },

  async getUsers(query: GetUsersQuery = {}): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.role) params.append('role', query.role);
      if (query.status) params.append('status', query.status);
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      const response = await api.get(`/api/v1/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  },

  async updateUserStatus(userId: string, isActive: boolean): Promise<RecentUser> {
    try {
      const response = await api.patch(`/api/v1/users/${userId}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/api/v1/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};
