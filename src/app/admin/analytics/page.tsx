'use client';

import { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Eye, 
  Clock,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, StatCard, AdminTable, AdminTabs, MetricCard, TopLessonsCard, SegmentChart, ActivityTimeline, AchievementsCard, ActivityHeatmap } from '@/components/admin';

const analyticsData = {
  overview: {
    totalUsers: 1247,
    totalLessons: 24,
    totalViews: 15689,
    totalTimeSpent: '2,847 giờ',
    averageSessionTime: '24 phút',
    completionRate: 68.5,
    userGrowth: 12.3,
    lessonViews: 8.7,
    engagementRate: 45.2
  },
  topLessons: [
    { id: 1, title: 'Git Basics - Introduction', views: 1245, completionRate: 78.5, rating: 4.8 },
    { id: 2, title: 'Advanced Git Workflows', views: 987, completionRate: 65.2, rating: 4.6 },
    { id: 3, title: 'Git Branching Strategies', views: 856, completionRate: 72.1, rating: 4.7 },
    { id: 4, title: 'Git Hooks and Automation', views: 743, completionRate: 58.9, rating: 4.4 },
    { id: 5, title: 'Git Collaboration Best Practices', views: 692, completionRate: 61.3, rating: 4.5 }
  ],
  userActivity: [
    { date: '2024-01-15', users: 45, lessons: 12, views: 234 },
    { date: '2024-01-16', users: 52, lessons: 15, views: 287 },
    { date: '2024-01-17', users: 48, lessons: 18, views: 312 },
    { date: '2024-01-18', users: 61, lessons: 22, views: 356 },
    { date: '2024-01-19', users: 58, lessons: 19, views: 298 },
    { date: '2024-01-20', users: 67, lessons: 25, views: 389 },
    { date: '2024-01-21', users: 73, lessons: 28, views: 412 }
  ],
  userSegments: [
    { segment: 'Học viên mới', count: 234, percentage: 18.8 },
    { segment: 'Học viên tích cực', count: 456, percentage: 36.6 },
    { segment: 'Học viên nâng cao', count: 298, percentage: 23.9 },
    { segment: 'Học viên hoàn thành', count: 259, percentage: 20.7 }
  ],
  deviceStats: [
    { device: 'Desktop', count: 892, percentage: 71.5 },
    { device: 'Mobile', count: 267, percentage: 21.4 },
    { device: 'Tablet', count: 88, percentage: 7.1 }
  ],
  timeStats: [
    { hour: '00:00', users: 12 },
    { hour: '02:00', users: 8 },
    { hour: '04:00', users: 5 },
    { hour: '06:00', users: 15 },
    { hour: '08:00', users: 45 },
    { hour: '10:00', users: 78 },
    { hour: '12:00', users: 92 },
    { hour: '14:00', users: 85 },
    { hour: '16:00', users: 67 },
    { hour: '18:00', users: 89 },
    { hour: '20:00', users: 95 },
    { hour: '22:00', users: 34 }
  ]
};

const timeRangeOptions = [
  { value: '7d', label: '7 ngày qua' },
  { value: '30d', label: '30 ngày qua' },
  { value: '90d', label: '90 ngày qua' },
  { value: '1y', label: '1 năm qua' }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'lessons', label: 'Bài học', icon: BookOpen },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'engagement', label: 'Tương tác', icon: Activity }
  ];
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics & Báo cáo"
        description="Phân tích hiệu suất và thống kê hệ thống"
        actions={
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        }
      />

      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng người dùng"
              value={analyticsData.overview.totalUsers}
              icon={Users}
              color="text-blue-500"
              trend={{
                value: analyticsData.overview.userGrowth
              }}
            />
            <StatCard
              title="Tổng bài học"
              value={analyticsData.overview.totalLessons}
              icon={BookOpen}
              color="text-green-500"
              trend={{
                value: analyticsData.overview.lessonViews
              }}
            />
            <StatCard
              title="Tổng lượt xem"
              value={analyticsData.overview.totalViews}
              icon={Eye}
              color="text-purple-500"
            />
            <StatCard
              title="Thời gian học"
              value={analyticsData.overview.totalTimeSpent}
              icon={Clock}
              color="text-orange-500"
            />
          </div>

          {}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <MetricCard
              title="Tỷ lệ hoàn thành"
              value={`${analyticsData.overview.completionRate}%`}
              icon={Target}
              color="text-blue-600"
              description="Tỷ lệ hoàn thành bài học trung bình"
              progress={analyticsData.overview.completionRate}
            />
            <MetricCard
              title="Thời gian phiên"
              value={analyticsData.overview.averageSessionTime}
              icon={Clock}
              color="text-green-600"
              description="Thời gian trung bình mỗi phiên học"
            />
            <MetricCard
              title="Tỷ lệ tương tác"
              value={`${analyticsData.overview.engagementRate}%`}
              icon={Activity}
              color="text-purple-600"
              description="Tỷ lệ người dùng tương tác tích cực"
            />
          </div>

          {}
          <TopLessonsCard lessons={analyticsData.topLessons} />
        </div>
      )}

      {}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SegmentChart 
              segments={analyticsData.userSegments} 
              title="Phân khúc người dùng" 
              color="bg-blue-600"
            />
            <SegmentChart 
              segments={analyticsData.deviceStats} 
              title="Thiết bị sử dụng" 
              color="bg-green-600"
            />
          </div>

          {}
          <ActivityHeatmap timeStats={analyticsData.timeStats} />
        </div>
      )}

      {}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Hiệu suất bài học</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bài học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoàn thành
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian TB
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topLessons.map((lesson) => (
                    <tr key={lesson.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{lesson.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{lesson.views.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${lesson.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-foreground">{lesson.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-foreground">⭐ {lesson.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">24 phút</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivityTimeline activities={analyticsData.userActivity} />
            <AchievementsCard />
          </div>
        </div>
      )}
    </div>
  );
}
