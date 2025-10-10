'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
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

// Mock data - trong thực tế sẽ fetch từ API
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

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (value: number) => {
    return value > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Báo cáo</h1>
          <p className="text-muted-foreground">Phân tích hiệu suất và thống kê hệ thống</p>
        </div>
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
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
            { id: 'lessons', label: 'Bài học', icon: BookOpen },
            { id: 'users', label: 'Người dùng', icon: Users },
            { id: 'engagement', label: 'Tương tác', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-foreground">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                <div className="flex items-center ml-2">
                  {getTrendIcon(analyticsData.overview.userGrowth)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.userGrowth)}`}>
                    {analyticsData.overview.userGrowth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Tổng bài học</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-foreground">{analyticsData.overview.totalLessons}</p>
                <div className="flex items-center ml-2">
                  {getTrendIcon(analyticsData.overview.lessonViews)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.lessonViews)}`}>
                    {analyticsData.overview.lessonViews}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Tổng lượt xem</p>
              <p className="text-2xl font-semibold text-foreground">{analyticsData.overview.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Thời gian học</p>
              <p className="text-2xl font-semibold text-foreground">{analyticsData.overview.totalTimeSpent}</p>
            </div>
          </div>
        </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tỷ lệ hoàn thành</h3>
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analyticsData.overview.completionRate}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${analyticsData.overview.completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Tỷ lệ hoàn thành bài học trung bình
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Thời gian phiên</h3>
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analyticsData.overview.averageSessionTime}
              </div>
              <p className="text-sm text-gray-500">
                Thời gian trung bình mỗi phiên học
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tỷ lệ tương tác</h3>
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analyticsData.overview.engagementRate}%
              </div>
              <p className="text-sm text-gray-500">
                Tỷ lệ người dùng tương tác tích cực
              </p>
            </Card>
          </div>

          {/* Top Lessons */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bài học phổ biến</h3>
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </div>
            <div className="space-y-4">
              {analyticsData.topLessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{lesson.views} lượt xem</span>
                        <span>{lesson.completionRate}% hoàn thành</span>
                        <span>⭐ {lesson.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${lesson.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{lesson.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Segments */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân khúc người dùng</h3>
              <div className="space-y-3">
                {analyticsData.userSegments.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{segment.segment}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {segment.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thiết bị sử dụng</h3>
              <div className="space-y-3">
                {analyticsData.deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{device.device}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {device.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động theo giờ</h3>
            <div className="grid grid-cols-12 gap-2">
              {analyticsData.timeStats.map((stat) => (
                <div key={stat.hour} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{stat.hour}</div>
                  <div 
                    className="bg-blue-100 rounded-sm h-8 flex items-end justify-center"
                    style={{ height: `${(stat.users / 100) * 32}px` }}
                  >
                    <div className="bg-blue-600 w-full rounded-sm"></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{stat.users}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất bài học</h3>
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
                        <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lesson.views.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${lesson.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{lesson.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">⭐ {lesson.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">24 phút</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động hàng ngày</h3>
              <div className="space-y-3">
                {analyticsData.userActivity.map((activity) => (
                  <div key={activity.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{activity.date}</div>
                      <div className="text-xs text-gray-500">{activity.users} người dùng</div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{activity.lessons} bài học</span>
                      <span>{activity.views} lượt xem</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thành tích</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-900">Học viên xuất sắc</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-900">Hoàn thành nhanh</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">Mục tiêu đạt được</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">156</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
