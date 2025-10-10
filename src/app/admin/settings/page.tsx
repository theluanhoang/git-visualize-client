'use client';

import { useState } from 'react';
import { 
  Save, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Mail,
  Globe,
  Lock,
  User,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, SettingsSidebar, SettingsSection } from '@/components/admin';

// Mock settings data
const initialSettings = {
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

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Gửi settings lên API
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      alert('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: Settings },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'backup', label: 'Sao lưu', icon: Database }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Cài đặt hệ thống"
        description="Quản lý cấu hình và cài đặt hệ thống"
        actions={
          <div className="flex items-center gap-3">
            {hasChanges && (
              <div className="flex items-center text-sm text-orange-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Có thay đổi chưa lưu
              </div>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SettingsSidebar 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <SettingsSection
              title="Cài đặt tổng quan"
              layout="mixed"
              fields={[
                {
                  id: "siteName",
                  label: "Tên trang web",
                  type: "text",
                  value: settings.general.siteName,
                  onChange: (value) => handleSettingChange('general', 'siteName', value)
                },
                {
                  id: "siteUrl",
                  label: "URL trang web",
                  type: "text",
                  value: settings.general.siteUrl,
                  onChange: (value) => handleSettingChange('general', 'siteUrl', value)
                },
                {
                  id: "siteDescription",
                  label: "Mô tả trang web",
                  type: "text",
                  value: settings.general.siteDescription,
                  onChange: (value) => handleSettingChange('general', 'siteDescription', value)
                },
                {
                  id: "adminEmail",
                  label: "Email quản trị",
                  type: "email",
                  value: settings.general.adminEmail,
                  onChange: (value) => handleSettingChange('general', 'adminEmail', value)
                },
                {
                  id: "timezone",
                  label: "Múi giờ",
                  type: "select",
                  value: settings.general.timezone,
                  onChange: (value) => handleSettingChange('general', 'timezone', value),
                  options: [
                    { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh" },
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "America/New_York" }
                  ]
                }
              ]}
            />
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <SettingsSection
              title="Cài đặt thông báo"
              layout="mixed"
              fields={[
                {
                  id: "emailNotifications",
                  label: "Thông báo email",
                  type: "toggle",
                  value: settings.notifications.emailNotifications,
                  onChange: (value) => handleSettingChange('notifications', 'emailNotifications', value),
                  description: "Gửi thông báo qua email"
                },
                {
                  id: "newUserRegistration",
                  label: "Đăng ký người dùng mới",
                  type: "toggle",
                  value: settings.notifications.newUserRegistration,
                  onChange: (value) => handleSettingChange('notifications', 'newUserRegistration', value),
                  description: "Thông báo khi có người dùng mới đăng ký"
                },
                {
                  id: "lessonPublished",
                  label: "Bài học được xuất bản",
                  type: "toggle",
                  value: settings.notifications.lessonPublished,
                  onChange: (value) => handleSettingChange('notifications', 'lessonPublished', value),
                  description: "Thông báo khi có bài học mới"
                },
                {
                  id: "systemAlerts",
                  label: "Cảnh báo hệ thống",
                  type: "toggle",
                  value: settings.notifications.systemAlerts,
                  onChange: (value) => handleSettingChange('notifications', 'systemAlerts', value),
                  description: "Thông báo về các vấn đề hệ thống"
                },
                {
                  id: "weeklyReports",
                  label: "Báo cáo hàng tuần",
                  type: "toggle",
                  value: settings.notifications.weeklyReports,
                  onChange: (value) => handleSettingChange('notifications', 'weeklyReports', value),
                  description: "Gửi báo cáo thống kê hàng tuần"
                }
              ]}
            />
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <SettingsSection
              title="Cài đặt bảo mật"
              layout="mixed"
              fields={[
                {
                  id: "requireEmailVerification",
                  label: "Xác thực email",
                  type: "toggle",
                  value: settings.security.requireEmailVerification,
                  onChange: (value) => handleSettingChange('security', 'requireEmailVerification', value),
                  description: "Yêu cầu xác thực email khi đăng ký"
                },
                {
                  id: "allowUserRegistration",
                  label: "Cho phép đăng ký",
                  type: "toggle",
                  value: settings.security.allowUserRegistration,
                  onChange: (value) => handleSettingChange('security', 'allowUserRegistration', value),
                  description: "Cho phép người dùng tự đăng ký"
                },
                {
                  id: "enableTwoFactor",
                  label: "Xác thực 2 yếu tố",
                  type: "toggle",
                  value: settings.security.enableTwoFactor,
                  onChange: (value) => handleSettingChange('security', 'enableTwoFactor', value),
                  description: "Yêu cầu 2FA cho tài khoản admin"
                },
                {
                  id: "maxLoginAttempts",
                  label: "Số lần đăng nhập tối đa",
                  type: "number",
                  value: settings.security.maxLoginAttempts,
                  onChange: (value) => handleSettingChange('security', 'maxLoginAttempts', parseInt(value))
                },
                {
                  id: "sessionTimeout",
                  label: "Thời gian phiên (phút)",
                  type: "number",
                  value: settings.security.sessionTimeout,
                  onChange: (value) => handleSettingChange('security', 'sessionTimeout', parseInt(value))
                }
              ]}
            />
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <SettingsSection
              title="Cài đặt giao diện"
              layout="mixed"
              fields={[
                {
                  id: "theme",
                  label: "Chủ đề",
                  type: "select",
                  value: settings.appearance.theme,
                  onChange: (value) => handleSettingChange('appearance', 'theme', value),
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
                  value: settings.appearance.primaryColor,
                  onChange: (value) => handleSettingChange('appearance', 'primaryColor', value),
                  className: "h-10"
                },
                {
                  id: "logoUrl",
                  label: "URL Logo",
                  type: "text",
                  value: settings.appearance.logoUrl,
                  onChange: (value) => handleSettingChange('appearance', 'logoUrl', value),
                  placeholder: "https://example.com/logo.png"
                },
                {
                  id: "faviconUrl",
                  label: "URL Favicon",
                  type: "text",
                  value: settings.appearance.faviconUrl,
                  onChange: (value) => handleSettingChange('appearance', 'faviconUrl', value),
                  placeholder: "https://example.com/favicon.ico"
                },
                {
                  id: "customCSS",
                  label: "CSS tùy chỉnh",
                  type: "textarea",
                  value: settings.appearance.customCSS,
                  onChange: (value) => handleSettingChange('appearance', 'customCSS', value),
                  placeholder: "/* CSS tùy chỉnh */"
                }
              ]}
            />
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <SettingsSection
              title="Cài đặt email"
              layout="double"
              fields={[
                {
                  id: "smtpHost",
                  label: "SMTP Host",
                  type: "text",
                  value: settings.email.smtpHost,
                  onChange: (value) => handleSettingChange('email', 'smtpHost', value)
                },
                {
                  id: "smtpPort",
                  label: "SMTP Port",
                  type: "number",
                  value: settings.email.smtpPort,
                  onChange: (value) => handleSettingChange('email', 'smtpPort', parseInt(value))
                },
                {
                  id: "smtpUsername",
                  label: "SMTP Username",
                  type: "text",
                  value: settings.email.smtpUsername,
                  onChange: (value) => handleSettingChange('email', 'smtpUsername', value)
                },
                {
                  id: "smtpPassword",
                  label: "SMTP Password",
                  type: "password",
                  value: settings.email.smtpPassword,
                  onChange: (value) => handleSettingChange('email', 'smtpPassword', value)
                },
                {
                  id: "fromEmail",
                  label: "Email gửi",
                  type: "email",
                  value: settings.email.fromEmail,
                  onChange: (value) => handleSettingChange('email', 'fromEmail', value)
                },
                {
                  id: "fromName",
                  label: "Tên người gửi",
                  type: "text",
                  value: settings.email.fromName,
                  onChange: (value) => handleSettingChange('email', 'fromName', value)
                }
              ]}
            />
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <SettingsSection
              title="Cài đặt sao lưu"
              layout="mixed"
              fields={[
                {
                  id: "autoBackup",
                  label: "Sao lưu tự động",
                  type: "toggle",
                  value: settings.backup.autoBackup,
                  onChange: (value) => handleSettingChange('backup', 'autoBackup', value),
                  description: "Tự động sao lưu dữ liệu"
                },
                {
                  id: "cloudStorage",
                  label: "Lưu trữ đám mây",
                  type: "toggle",
                  value: settings.backup.cloudStorage,
                  onChange: (value) => handleSettingChange('backup', 'cloudStorage', value),
                  description: "Sao lưu lên cloud storage"
                },
                {
                  id: "backupFrequency",
                  label: "Tần suất sao lưu",
                  type: "select",
                  value: settings.backup.backupFrequency,
                  onChange: (value) => handleSettingChange('backup', 'backupFrequency', value),
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
                  value: settings.backup.backupRetention,
                  onChange: (value) => handleSettingChange('backup', 'backupRetention', parseInt(value))
                }
              ]}
              actions={[
                {
                  label: "Tạo sao lưu",
                  onClick: () => console.log('Create backup'),
                  variant: "outline"
                }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
