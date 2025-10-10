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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">Quản lý cấu hình và cài đặt hệ thống</p>
        </div>
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Cài đặt tổng quan</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="siteName">Tên trang web</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">URL trang web</Label>
                    <Input
                      id="siteUrl"
                      value={settings.general.siteUrl}
                      onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Mô tả trang web</Label>
                  <Input
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="adminEmail">Email quản trị</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.general.adminEmail}
                      onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Múi giờ</Label>
                    <Select 
                      value={settings.general.timezone} 
                      onValueChange={(value) => handleSettingChange('general', 'timezone', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt thông báo</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Thông báo email</h3>
                      <p className="text-sm text-gray-500">Gửi thông báo qua email</p>
                    </div>
                    <Toggle
                      pressed={settings.notifications.emailNotifications}
                      onPressedChange={(pressed) => handleSettingChange('notifications', 'emailNotifications', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Đăng ký người dùng mới</h3>
                      <p className="text-sm text-gray-500">Thông báo khi có người dùng mới đăng ký</p>
                    </div>
                    <Toggle
                      pressed={settings.notifications.newUserRegistration}
                      onPressedChange={(pressed) => handleSettingChange('notifications', 'newUserRegistration', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Bài học được xuất bản</h3>
                      <p className="text-sm text-gray-500">Thông báo khi có bài học mới</p>
                    </div>
                    <Toggle
                      pressed={settings.notifications.lessonPublished}
                      onPressedChange={(pressed) => handleSettingChange('notifications', 'lessonPublished', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Cảnh báo hệ thống</h3>
                      <p className="text-sm text-gray-500">Thông báo về các vấn đề hệ thống</p>
                    </div>
                    <Toggle
                      pressed={settings.notifications.systemAlerts}
                      onPressedChange={(pressed) => handleSettingChange('notifications', 'systemAlerts', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Báo cáo hàng tuần</h3>
                      <p className="text-sm text-gray-500">Gửi báo cáo thống kê hàng tuần</p>
                    </div>
                    <Toggle
                      pressed={settings.notifications.weeklyReports}
                      onPressedChange={(pressed) => handleSettingChange('notifications', 'weeklyReports', pressed)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt bảo mật</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Xác thực email</h3>
                      <p className="text-sm text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
                    </div>
                    <Toggle
                      pressed={settings.security.requireEmailVerification}
                      onPressedChange={(pressed) => handleSettingChange('security', 'requireEmailVerification', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Cho phép đăng ký</h3>
                      <p className="text-sm text-gray-500">Cho phép người dùng tự đăng ký</p>
                    </div>
                    <Toggle
                      pressed={settings.security.allowUserRegistration}
                      onPressedChange={(pressed) => handleSettingChange('security', 'allowUserRegistration', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Xác thực 2 yếu tố</h3>
                      <p className="text-sm text-gray-500">Yêu cầu 2FA cho tài khoản admin</p>
                    </div>
                    <Toggle
                      pressed={settings.security.enableTwoFactor}
                      onPressedChange={(pressed) => handleSettingChange('security', 'enableTwoFactor', pressed)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Thời gian phiên (phút)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt giao diện</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="theme">Chủ đề</Label>
                    <Select 
                      value={settings.appearance.theme} 
                      onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Sáng</SelectItem>
                        <SelectItem value="dark">Tối</SelectItem>
                        <SelectItem value="auto">Tự động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Màu chính</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="logoUrl">URL Logo</Label>
                    <Input
                      id="logoUrl"
                      value={settings.appearance.logoUrl}
                      onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
                      className="mt-1"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="faviconUrl">URL Favicon</Label>
                    <Input
                      id="faviconUrl"
                      value={settings.appearance.faviconUrl}
                      onChange={(e) => handleSettingChange('appearance', 'faviconUrl', e.target.value)}
                      className="mt-1"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customCSS">CSS tùy chỉnh</Label>
                  <textarea
                    id="customCSS"
                    value={settings.appearance.customCSS}
                    onChange={(e) => handleSettingChange('appearance', 'customCSS', e.target.value)}
                    className="mt-1 w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder="/* CSS tùy chỉnh */"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt email</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.email.smtpHost}
                      onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.email.smtpUsername}
                      onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fromEmail">Email gửi</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">Tên người gửi</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt sao lưu</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Sao lưu tự động</h3>
                      <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu</p>
                    </div>
                    <Toggle
                      pressed={settings.backup.autoBackup}
                      onPressedChange={(pressed) => handleSettingChange('backup', 'autoBackup', pressed)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Lưu trữ đám mây</h3>
                      <p className="text-sm text-gray-500">Sao lưu lên cloud storage</p>
                    </div>
                    <Toggle
                      pressed={settings.backup.cloudStorage}
                      onPressedChange={(pressed) => handleSettingChange('backup', 'cloudStorage', pressed)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="backupFrequency">Tần suất sao lưu</Label>
                    <Select 
                      value={settings.backup.backupFrequency} 
                      onValueChange={(value) => handleSettingChange('backup', 'backupFrequency', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hàng giờ</SelectItem>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backupRetention">Thời gian lưu trữ (ngày)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={settings.backup.backupRetention}
                      onChange={(e) => handleSettingChange('backup', 'backupRetention', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Sao lưu thủ công</h3>
                      <p className="text-sm text-gray-500">Tạo bản sao lưu ngay bây giờ</p>
                    </div>
                    <Button variant="outline">
                      Tạo sao lưu
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
