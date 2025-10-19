import { Card } from '@/components/ui/card';
import { ActivityItemProps } from './analytics-types';

export function ActivityItem({ date, users, lessons, views }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="text-sm font-medium text-gray-900">{date}</div>
        <div className="text-xs text-gray-500">{users} người dùng</div>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <span>{lessons} bài học</span>
        <span>{views} lượt xem</span>
      </div>
    </div>
  );
}

export function ActivityTimeline({ activities }: { activities: ActivityItemProps[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Hoạt động hàng ngày</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </Card>
  );
}
