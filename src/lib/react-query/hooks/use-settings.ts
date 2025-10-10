import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Settings } from '@/lib/schemas/settings';

// Mock API functions - replace with actual API calls
const settingsApi = {
  get: async (): Promise<Settings> => {
    // Mock data
    return {
      general: {
        siteName: 'Git Learning Platform',
        siteDescription: 'Học Git một cách trực quan và hiệu quả',
        siteUrl: 'https://git-learning.com',
        adminEmail: 'admin@git-learning.com',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi'
      },
      notifications: {
        emailNotifications: true,
        newUserRegistration: true,
        lessonPublished: true,
        systemAlerts: true,
        weeklyReports: true,
        maintenanceMode: false
      },
      security: {
        requireEmailVerification: true,
        allowUserRegistration: true,
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        enableTwoFactor: false,
        passwordMinLength: 8
      },
      appearance: {
        theme: 'light',
        primaryColor: '#3B82F6',
        logoUrl: '',
        faviconUrl: '',
        customCSS: ''
      },
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        fromEmail: 'noreply@git-learning.com',
        fromName: 'Git Learning Platform'
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        backupRetention: 30,
        cloudStorage: false
      }
    };
  },
  
  update: async (data: Settings) => {
    // Mock API call
    console.log('Updating settings:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return data;
  }
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
