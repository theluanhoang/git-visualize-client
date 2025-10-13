'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, Settings } from '@/lib/schemas/settings';
import { useSettings, useUpdateSettings } from '@/lib/react-query/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Card } from '@/components/ui/card';
import { Save, AlertTriangle } from 'lucide-react';
import { PageHeader, SettingsSidebar, SettingsSection } from '@/components/admin';
import { useState } from 'react';

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState('general');
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
    values: settings
  });

  const onSubmit = async (data: Settings) => {
    try {
      await updateSettingsMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: require('lucide-react').Settings },
    { id: 'notifications', label: 'Thông báo', icon: require('lucide-react').Bell },
    { id: 'security', label: 'Bảo mật', icon: require('lucide-react').Shield },
    { id: 'appearance', label: 'Giao diện', icon: require('lucide-react').Palette },
    { id: 'email', label: 'Email', icon: require('lucide-react').Mail },
    { id: 'backup', label: 'Sao lưu', icon: require('lucide-react').Database }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Cài đặt hệ thống"
        description="Quản lý cấu hình và cài đặt hệ thống"
        actions={
          <div className="flex items-center gap-3">
            {isDirty && (
              <div className="flex items-center text-sm text-orange-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Có thay đổi chưa lưu
              </div>
            )}
            <Button 
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty || updateSettingsMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettingsMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {}
        <div className="lg:col-span-1">
          <SettingsSidebar 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            {}
            {activeTab === 'general' && (
              <SettingsSection
                title="Cài đặt tổng quan"
                layout="mixed"
                fields={[
                  {
                    id: "siteName",
                    label: "Tên trang web",
                    type: "text",
                    value: watch('general.siteName'),
                    onChange: (value) => setValue('general.siteName', value)
                  },
                  {
                    id: "siteUrl",
                    label: "URL trang web",
                    type: "text",
                    value: watch('general.siteUrl'),
                    onChange: (value) => setValue('general.siteUrl', value)
                  },
                  {
                    id: "siteDescription",
                    label: "Mô tả trang web",
                    type: "text",
                    value: watch('general.siteDescription'),
                    onChange: (value) => setValue('general.siteDescription', value)
                  },
                  {
                    id: "adminEmail",
                    label: "Email quản trị",
                    type: "email",
                    value: watch('general.adminEmail'),
                    onChange: (value) => setValue('general.adminEmail', value)
                  },
                  {
                    id: "timezone",
                    label: "Múi giờ",
                    type: "select",
                    value: watch('general.timezone'),
                    onChange: (value) => setValue('general.timezone', value),
                    options: [
                      { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh" },
                      { value: "UTC", label: "UTC" },
                      { value: "America/New_York", label: "America/New_York" }
                    ]
                  }
                ]}
              />
            )}

            {}
            {activeTab === 'notifications' && (
              <SettingsSection
                title="Cài đặt thông báo"
                layout="mixed"
                fields={[
                  {
                    id: "emailNotifications",
                    label: "Thông báo email",
                    type: "toggle",
                    value: watch('notifications.emailNotifications'),
                    onChange: (value) => setValue('notifications.emailNotifications', value),
                    description: "Gửi thông báo qua email"
                  },
                  {
                    id: "newUserRegistration",
                    label: "Đăng ký người dùng mới",
                    type: "toggle",
                    value: watch('notifications.newUserRegistration'),
                    onChange: (value) => setValue('notifications.newUserRegistration', value),
                    description: "Thông báo khi có người dùng mới đăng ký"
                  },
                  {
                    id: "lessonPublished",
                    label: "Bài học được xuất bản",
                    type: "toggle",
                    value: watch('notifications.lessonPublished'),
                    onChange: (value) => setValue('notifications.lessonPublished', value),
                    description: "Thông báo khi có bài học mới"
                  },
                  {
                    id: "systemAlerts",
                    label: "Cảnh báo hệ thống",
                    type: "toggle",
                    value: watch('notifications.systemAlerts'),
                    onChange: (value) => setValue('notifications.systemAlerts', value),
                    description: "Thông báo về các vấn đề hệ thống"
                  },
                  {
                    id: "weeklyReports",
                    label: "Báo cáo hàng tuần",
                    type: "toggle",
                    value: watch('notifications.weeklyReports'),
                    onChange: (value) => setValue('notifications.weeklyReports', value),
                    description: "Gửi báo cáo thống kê hàng tuần"
                  }
                ]}
              />
            )}

            {}
            {activeTab === 'security' && (
              <SettingsSection
                title="Cài đặt bảo mật"
                layout="mixed"
                fields={[
                  {
                    id: "requireEmailVerification",
                    label: "Xác thực email",
                    type: "toggle",
                    value: watch('security.requireEmailVerification'),
                    onChange: (value) => setValue('security.requireEmailVerification', value),
                    description: "Yêu cầu xác thực email khi đăng ký"
                  },
                  {
                    id: "allowUserRegistration",
                    label: "Cho phép đăng ký",
                    type: "toggle",
                    value: watch('security.allowUserRegistration'),
                    onChange: (value) => setValue('security.allowUserRegistration', value),
                    description: "Cho phép người dùng tự đăng ký"
                  },
                  {
                    id: "enableTwoFactor",
                    label: "Xác thực 2 yếu tố",
                    type: "toggle",
                    value: watch('security.enableTwoFactor'),
                    onChange: (value) => setValue('security.enableTwoFactor', value),
                    description: "Yêu cầu 2FA cho tài khoản admin"
                  },
                  {
                    id: "maxLoginAttempts",
                    label: "Số lần đăng nhập tối đa",
                    type: "number",
                    value: watch('security.maxLoginAttempts'),
                    onChange: (value) => setValue('security.maxLoginAttempts', parseInt(value))
                  },
                  {
                    id: "sessionTimeout",
                    label: "Thời gian phiên (phút)",
                    type: "number",
                    value: watch('security.sessionTimeout'),
                    onChange: (value) => setValue('security.sessionTimeout', parseInt(value))
                  }
                ]}
              />
            )}

            {}
            {activeTab === 'appearance' && (
              <SettingsSection
                title="Cài đặt giao diện"
                layout="mixed"
                fields={[
                  {
                    id: "theme",
                    label: "Chủ đề",
                    type: "select",
                    value: watch('appearance.theme'),
                    onChange: (value) => setValue('appearance.theme', value as any),
                    options: [
                      { value: "light", label: "Sáng" },
                      { value: "dark", label: "Tối" },
                      { value: "auto", label: "Tự động" }
                    ]
                  },
                  {
                    id: "primaryColor",
                    label: "Màu chính",
                    type: "color",
                    value: watch('appearance.primaryColor'),
                    onChange: (value) => setValue('appearance.primaryColor', value),
                    className: "h-10"
                  },
                  {
                    id: "logoUrl",
                    label: "URL Logo",
                    type: "text",
                    value: watch('appearance.logoUrl'),
                    onChange: (value) => setValue('appearance.logoUrl', value),
                    placeholder: "https://example.com/logo.png"
                  },
                  {
                    id: "faviconUrl",
                    label: "URL Favicon",
                    type: "text",
                    value: watch('appearance.faviconUrl'),
                    onChange: (value) => setValue('appearance.faviconUrl', value),
                    placeholder: "https://example.com/favicon.ico"
                  },
                  {
                    id: "customCSS",
                    label: "CSS tùy chỉnh",
                    type: "textarea",
                    value: watch('appearance.customCSS'),
                    onChange: (value) => setValue('appearance.customCSS', value),
                    placeholder: ""
                  }
                ]}
              />
            )}

            {}
            {activeTab === 'email' && (
              <SettingsSection
                title="Cài đặt email"
                layout="double"
                fields={[
                  {
                    id: "smtpHost",
                    label: "SMTP Host",
                    type: "text",
                    value: watch('email.smtpHost'),
                    onChange: (value) => setValue('email.smtpHost', value)
                  },
                  {
                    id: "smtpPort",
                    label: "SMTP Port",
                    type: "number",
                    value: watch('email.smtpPort'),
                    onChange: (value) => setValue('email.smtpPort', parseInt(value))
                  },
                  {
                    id: "smtpUsername",
                    label: "SMTP Username",
                    type: "text",
                    value: watch('email.smtpUsername'),
                    onChange: (value) => setValue('email.smtpUsername', value)
                  },
                  {
                    id: "smtpPassword",
                    label: "SMTP Password",
                    type: "password",
                    value: watch('email.smtpPassword'),
                    onChange: (value) => setValue('email.smtpPassword', value)
                  },
                  {
                    id: "fromEmail",
                    label: "Email gửi",
                    type: "email",
                    value: watch('email.fromEmail'),
                    onChange: (value) => setValue('email.fromEmail', value)
                  },
                  {
                    id: "fromName",
                    label: "Tên người gửi",
                    type: "text",
                    value: watch('email.fromName'),
                    onChange: (value) => setValue('email.fromName', value)
                  }
                ]}
              />
            )}

            {}
            {activeTab === 'backup' && (
              <SettingsSection
                title="Cài đặt sao lưu"
                layout="mixed"
                fields={[
                  {
                    id: "autoBackup",
                    label: "Sao lưu tự động",
                    type: "toggle",
                    value: watch('backup.autoBackup'),
                    onChange: (value) => setValue('backup.autoBackup', value),
                    description: "Tự động sao lưu dữ liệu"
                  },
                  {
                    id: "cloudStorage",
                    label: "Lưu trữ đám mây",
                    type: "toggle",
                    value: watch('backup.cloudStorage'),
                    onChange: (value) => setValue('backup.cloudStorage', value),
                    description: "Sao lưu lên cloud storage"
                  },
                  {
                    id: "backupFrequency",
                    label: "Tần suất sao lưu",
                    type: "select",
                    value: watch('backup.backupFrequency'),
                    onChange: (value) => setValue('backup.backupFrequency', value as any),
                    options: [
                      { value: "hourly", label: "Hàng giờ" },
                      { value: "daily", label: "Hàng ngày" },
                      { value: "weekly", label: "Hàng tuần" },
                      { value: "monthly", label: "Hàng tháng" }
                    ]
                  },
                  {
                    id: "backupRetention",
                    label: "Thời gian lưu trữ (ngày)",
                    type: "number",
                    value: watch('backup.backupRetention'),
                    onChange: (value) => setValue('backup.backupRetention', parseInt(value))
                  }
                ]}
                actions={[
                  {
                    label: "Tạo sao lưu",
                    onClick: () => {},
                    variant: "outline"
                  }
                ]}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
