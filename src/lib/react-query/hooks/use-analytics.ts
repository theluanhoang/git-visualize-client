import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalyticsService, DashboardStats, RecentLesson, GetUsersQuery, UsersResponse } from '@/services/analytics';

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['analytics', 'dashboard-stats'],
    queryFn: AnalyticsService.getDashboardStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useRecentUsers = (limit: number = 5) => {
  return useUsers({ page: 1, limit, sortBy: 'createdAt', sortOrder: 'DESC' });
};

export const useRecentLessons = (limit: number = 10) => {
  return useQuery<RecentLesson[]>({
    queryKey: ['analytics', 'recent-lessons', limit],
    queryFn: () => AnalyticsService.getRecentLessons(limit),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUsers = (query: GetUsersQuery = {}) => {
  return useQuery<UsersResponse>({
    queryKey: ['analytics', 'users', query],
    queryFn: () => AnalyticsService.getUsers(query),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      AnalyticsService.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => AnalyticsService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useSendUserEmail = () => {
  return useMutation({
    mutationFn: ({ userId, subject, message, attachments, onProgress }: { userId: string; subject: string; message: string; attachments?: File[]; onProgress?: (percent: number, loaded: number, total?: number) => void }) =>
      AnalyticsService.sendUserEmail(userId, subject, message, attachments, onProgress),
  });
};
