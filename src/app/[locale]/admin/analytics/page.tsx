'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Eye, 
  Clock,
  Download,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, StatCard, AdminTabs, MetricCard, TopLessonsCard, SegmentChart, ActivityTimeline, AchievementsCard, ActivityHeatmap } from '@/components/admin';
import { useTranslations } from 'next-intl';
import { useDashboardStats, useAnalyticsMetrics } from '@/lib/react-query/hooks/use-analytics';
import { useLessons } from '@/lib/react-query/hooks/use-lessons';
import { formatTimeWithI18n } from '@/utils/format-time';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const t = useTranslations('admin.analytics');
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: metrics, isLoading: metricsLoading } = useAnalyticsMetrics();
  const { data: allLessons = [], isLoading: lessonsLoading } = useLessons({ limit: 100 });
  
  const analyticsData = useMemo(() => {
    const totalUsers = stats?.totalUsers || 1;
    
    const lessonPerformance = [...allLessons]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .map((lesson) => {
        const completedUsersCount = (lesson as any).completedUsersCount || 0;
        const completionRate = totalUsers > 0 
          ? Math.round((completedUsersCount / totalUsers) * 100 * 10) / 10 
          : 0;
        
        return {
          id: lesson.id || '',
          title: lesson.title,
          views: lesson.views || 0,
          completionRate,
          rating: lesson.averageRating || 0 
        };
      });
    
    const topLessons = lessonPerformance.slice(0, 5);

    const totalViews = allLessons.reduce((sum, lesson) => sum + (lesson.views || 0), 0);
    
    const completionRate = allLessons.length > 0 ? 68.5 : 0;
    
    return {
      overview: {
        totalUsers: stats?.totalUsers || 0,
        totalLessons: stats?.totalLessons || 0,
        totalViews: stats?.totalViews || totalViews,
        totalTimeSpent: metrics?.totalTimeSpent || { hours: 0, minutes: 0 },
        averageSessionTime: metrics?.averageSessionTime || { hours: 0, minutes: 0 },
        completionRate: metrics?.completionRate || completionRate,
        userGrowth: 12.3,
        lessonViews: 8.7, 
        engagementRate: metrics?.engagementRate || 0
      },
      topLessons,
      lessonPerformance,
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
        { segment: t('newStudents'), count: 234, percentage: 18.8 },
        { segment: t('activeStudents'), count: 456, percentage: 36.6 },
        { segment: t('advancedStudents'), count: 298, percentage: 23.9 },
        { segment: t('completedStudents'), count: 259, percentage: 20.7 }
      ],
      deviceStats: [
        { device: t('desktop'), count: 892, percentage: 71.5 },
        { device: t('mobile'), count: 267, percentage: 21.4 },
        { device: t('tablet'), count: 88, percentage: 7.1 }
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
  }, [stats, metrics, allLessons, t]);

  const timeRangeOptions = [
    { value: '7d', label: t('last7Days') },
    { value: '30d', label: t('last30Days') },
    { value: '90d', label: t('last90Days') },
    { value: '1y', label: t('lastYear') }
  ];

  const tabs = [
    { id: 'overview', label: t('overview'), icon: BarChart3 },
    { id: 'lessons', label: t('lessons'), icon: BookOpen },
    { id: 'users', label: t('users'), icon: Users },
    { id: 'engagement', label: t('engagement'), icon: Activity }
  ];
  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('title')}
        description={t('description')}
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
              {t('exportReport')}
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
              title={t('totalUsers')}
              value={statsLoading ? '...' : analyticsData.overview.totalUsers}
              icon={Users}
              color="text-blue-500"
              trend={{
                value: analyticsData.overview.userGrowth
              }}
            />
            <StatCard
              title={t('totalLessons')}
              value={statsLoading ? '...' : analyticsData.overview.totalLessons}
              icon={BookOpen}
              color="text-green-500"
              trend={{
                value: analyticsData.overview.lessonViews
              }}
            />
            <StatCard
              title={t('totalViews')}
              value={statsLoading ? '...' : analyticsData.overview.totalViews.toLocaleString('vi-VN')}
              icon={Eye}
              color="text-purple-500"
            />
            <StatCard
              title={t('totalTimeSpent')}
              value={formatTimeWithI18n(analyticsData.overview.totalTimeSpent, t)}
              icon={Clock}
              color="text-orange-500"
            />
          </div>

          {}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <MetricCard
              title={t('completionRate')}
              value={`${analyticsData.overview.completionRate}%`}
              icon={Target}
              color="text-blue-600"
              description={t('completionRateDescription')}
              progress={analyticsData.overview.completionRate}
            />
            <MetricCard
              title={t('averageSessionTime')}
              value={formatTimeWithI18n(analyticsData.overview.averageSessionTime, t)}
              icon={Clock}
              color="text-green-600"
              description={t('averageSessionTimeDescription')}
            />
            <MetricCard
              title={t('engagementRate')}
              value={`${analyticsData.overview.engagementRate}%`}
              icon={Activity}
              color="text-purple-600"
              description={t('engagementRateDescription')}
            />
          </div>

          {}
          {lessonsLoading ? (
            <Card className="p-6">
              <div className="text-center text-muted-foreground">Đang tải dữ liệu...</div>
            </Card>
          ) : (
            <TopLessonsCard lessons={analyticsData.topLessons} />
          )}
        </div>
      )}

      {}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SegmentChart 
              segments={analyticsData.userSegments} 
              title={t('userSegments')} 
              color="bg-blue-600"
            />
            <SegmentChart 
              segments={analyticsData.deviceStats} 
              title={t('deviceUsage')} 
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
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('lessonPerformance')}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('lesson')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('views')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('completion')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('rating')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('averageTime')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analyticsData.lessonPerformance.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                        {t('noLessonData')}
                      </td>
                    </tr>
                  ) : (
                    analyticsData.lessonPerformance.map((lesson) => (
                      <tr 
                        key={lesson.id} 
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{lesson.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">{lesson.views.toLocaleString('vi-VN')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(lesson.completionRate, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-foreground font-medium min-w-[3rem]">{lesson.completionRate.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-foreground">{lesson.rating > 0 ? `⭐ ${lesson.rating.toFixed(1)}` : 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground">-</div>
                        </td>
                      </tr>
                    ))
                  )}
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
